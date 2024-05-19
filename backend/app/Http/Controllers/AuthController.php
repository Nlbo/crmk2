<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * @param LoginRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->input('email'))->first();

        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            throw ValidationException::withMessages(
                [
                    'email' => ['The provided credentials are incorrect.'],
                ]
            );
        }

        return response()->json(
            [
                'token' => $user->createToken('default')->plainTextToken,
                'user' => $user->load(['roles.permissions', 'permissions'])
            ]
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->bearerToken();
        [$id] = explode('|', $token);

        $user = $request->user();
        $user->tokens()->where('id', $id)->delete();

        return response()->json('ok');
    }

    public function logoutFromAll(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->tokens()->delete();

        return response()->json('ok');
    }
}
