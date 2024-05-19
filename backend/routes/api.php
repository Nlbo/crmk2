<?php

use App\Helpers\PermissionsDictionary;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\CharacterController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ContentChainController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SampleWorkflowController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\StickerSetController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TelegramBotController;
use App\Http\Controllers\UserController;
use App\Services\Bot;
use App\Services\Updates\UpdateParser;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Broadcast::routes(["middleware" => "auth:sanctum"]);

Route::post(
    'telegram/{token}/webhook',
    function (\Illuminate\Http\Request $request, Bot $bot, UpdateParser $parser) {
        $bot->commandsHandler(true);

        $body = $request->post();

        $parser->parse($body);

        return 'ok';
    }
)->name('telegram.webhook');
Route::get('runFlow', [SampleWorkflowController::class, 'runFlow']);
Route::post('login', [AuthController::class, 'login']);
Route::post('users/register', [UserController::class, 'register']);

Route::middleware(['auth:sanctum'])->group(
    function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('logoutFromAll', [AuthController::class, 'logoutFromAll']);

        Route::post('upload', [FileController::class, 'store']);

        Route::apiResource('telegram/bots', TelegramBotController::class);
        Route::apiResource('telegram/bots/{bot}/chains', ContentChainController::class);
        Route::post('chains/{chain}/content/reorder', [ContentController::class, 'reorder'])
            ->middleware('can:' . PermissionsDictionary::UPDATE_CONTENT);
        Route::apiResource('chains/{chain}/content', ContentController::class);
        Route::apiResource('stickerSets', StickerSetController::class)->except(['show', 'destroy']);

        Route::apiResource('channels', ChannelController::class);
        Route::apiResource('posts', PostController::class);
        Route::apiResource('languages', LanguageController::class)->only(['index', 'show']);
        Route::apiResource('countries', CountryController::class)->only(['index', 'show']);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('subjects', SubjectController::class);
        Route::apiResource('characters', CharacterController::class);
        Route::get('attachments/{attachment}', [AttachmentController::class, 'show']);

        Route::post('posts/{post}/scheduleTimes', [ScheduleController::class, 'addPostScheduleTime'])
            ->middleware('can:' . PermissionsDictionary::CREATE_SCHEDULE);

        Route::get('channels/{channel}/schedule', [ScheduleController::class, 'index'])
            ->middleware('can:' . PermissionsDictionary::VIEW_SCHEDULE);
        Route::post('channels/{channel}/scheduleTimes', [ScheduleController::class, 'addScheduleTime'])
            ->middleware('can:' . PermissionsDictionary::CREATE_SCHEDULE);
        Route::patch('channels/{channel}/scheduleTimes/{scheduleTime}', [ScheduleController::class, 'editScheduleTime'])
            ->middleware('can:' . PermissionsDictionary::UPDATE_SCHEDULE);
        Route::delete(
            'channels/{channel}/scheduleTimes/{scheduleTime}',
            [ScheduleController::class, 'deleteScheduleTime']
        )
            ->middleware('can:' . PermissionsDictionary::DELETE_SCHEDULE);

        Route::get('users', [UserController::class, 'index']);
        Route::get('users/me', [UserController::class, 'me']);
        Route::get('users/{user}', [UserController::class, 'show']);
        Route::patch('users/{user}', [UserController::class, 'update']);
        Route::delete('users/{user}', [UserController::class, 'delete'])->middleware(
            'can:' . PermissionsDictionary::DELETE_USERS
        );

        Route::middleware('can:' . PermissionsDictionary::MANAGE_ROLES_AND_PERMISSIONS)
            ->group(function () {
                Route::get('permissions', [PermissionController::class, 'index']);
                Route::get('roles', [RoleController::class, 'index']);
                Route::post('roles', [RoleController::class, 'create']);
                Route::patch('roles/{role}', [RoleController::class, 'update']);
                Route::get('roles/{role}', [RoleController::class, 'show']);
            });
        Route::middleware('can:' . PermissionsDictionary::MANAGE_CHATS)
            ->group(function () {
                Route::get('customers', [ChatController::class, 'getCustomers']);
                Route::get('customers/{customer}', [ChatController::class, 'getCustomer']);
                Route::get('customers/{customer}/chats', [ChatController::class, 'getChats']);
                Route::get('chats/{chat}/messages', [ChatController::class, 'getMessages']);
                Route::post('chats/{chat}/messages', [ChatController::class, 'createMessage']);
                Route::patch('chats/{chat}messages/{message}', [ChatController::class, 'updateMessage']);
            });
    }
);
