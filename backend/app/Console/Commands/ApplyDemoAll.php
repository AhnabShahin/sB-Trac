<?php

namespace App\Console\Commands;

use App\Http\Controllers\Admin\PageController;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Http\Request;

class ApplyDemoAll extends Command
{
    protected $signature = 'pages:apply-demo {--slug=* : Limit to these slugs}';

    protected $description = 'Apply the demo-data snapshot into the DB for every editable page (or the given slugs).';

    public function handle(PageController $controller): int
    {
        $user = User::query()->first();

        if (! $user) {
            $this->error('No users exist — create an admin first (php artisan app:create-admin).');

            return self::FAILURE;
        }

        $only = $this->option('slug');
        $applied = 0;

        foreach (config('pages.pages') as $page) {
            if (empty($page['editable'])) {
                continue;
            }

            $slug = $page['slug'];

            if ($only && ! in_array($slug, $only, true)) {
                continue;
            }

            if (! is_file(base_path("demo-data/{$slug}.json"))) {
                $this->warn("skip {$slug} (no demo-data file)");

                continue;
            }

            $request = Request::create("/api/pages/{$slug}/apply-demo", 'POST');
            $request->setUserResolver(fn () => $user);

            try {
                $controller->applyDemo($request, $slug);
                $this->info("applied {$slug}");
                $applied++;
            } catch (\Throwable $e) {
                $this->error("failed {$slug}: {$e->getMessage()}");
            }
        }

        $this->line("Done — {$applied} page(s) applied as {$user->email}.");

        return self::SUCCESS;
    }
}
