<?php

namespace App\Http\Controllers;

use App\Workflows\ImportStickers\ImportStickersWorkflow;
use Illuminate\Http\JsonResponse;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Temporal\Client\WorkflowClient;
use Temporal\Client\WorkflowOptions;
use Temporal\Common\RetryOptions;

class SampleWorkflowController extends Controller
{
    /**
     * @throws TelegramSDKException
     */
    public function runFlow(WorkflowClient $client): JsonResponse
    {
        $workflow = $client->newWorkflowStub(
            ImportStickersWorkflow::class,
            WorkflowOptions::new()->withRetryOptions(
                RetryOptions::new()->withMaximumAttempts(1)
            )->withWorkflowExecutionTimeout("120 seconds")
        );
        return response()->json($workflow->import('OldAnimation'));
    }
}
