<?php

namespace App\Listeners;

use Arquivei\LaravelPrometheusExporter\PrometheusExporter;
use Laravel\Horizon\Contracts\JobRepository;
use Laravel\Horizon\Events\JobDeleted;
use Laravel\Horizon\Events\JobFailed;

class JobMetricListener
{

    public function __construct(
        private JobRepository $repository,
        private PrometheusExporter $exporter
    ) {
    }

    /**
     * Handle the event.
     *
     * @param JobDeleted|JobFailed $event
     * @return void
     */
    public function handle(JobDeleted|JobFailed $event)
    {
        $job = $this->repository->getJobs([$event->job->getJobId()])->first();
        if ($event instanceof JobFailed) {
            $this->createMetric(
                $job->failed_at - $job->reserved_at,
                $job->name,
                true,
                $event->exception->getMessage()
            );
        } elseif ($event instanceof JobDeleted && !$event->job->hasFailed()) {
            $this->createMetric(
                $job->completed_at - $job->reserved_at,
                $job->name
            );
        }
    }

    private function createMetric(float $duration, string $job, bool $failed = false, string $exception = '')
    {
        $histogram = $this->exporter->getOrRegisterHistogram(
            'jobs_execution_time_seconds',
            'It observes jobs execution time.',
            [
                'job_name',
                'status',
                'exception'
            ],
            config('prometheus.queue_buckets') ?? null
        );

        $histogram->observe(
            $duration,
            [
                $job,
                $failed ? 'failed' : 'success',
                $exception
            ]
        );
    }
}
