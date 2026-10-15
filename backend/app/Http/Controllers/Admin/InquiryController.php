<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

// Admin-only triage of contact-form submissions: a filterable, paginated list
// plus per-record read / status-change / delete. Auth is enforced by the
// route group (auth:sanctum), as with the page-management endpoints.
class InquiryController extends Controller
{
    /** Filterable, paginated list. Newest first. */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'status' => ['sometimes', 'nullable', Rule::in(Inquiry::STATUSES)],
            'service' => ['sometimes', 'nullable', 'string', 'max:255'],
            'q' => ['sometimes', 'nullable', 'string', 'max:255'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Inquiry::query()->latest();

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['service'])) {
            $query->where('service', $filters['service']);
        }

        if (! empty($filters['q'])) {
            $term = '%' . $filters['q'] . '%';
            $query->where(function ($q) use ($term) {
                $q->where('full_name', 'like', $term)
                    ->orWhere('company', 'like', $term)
                    ->orWhere('email', 'like', $term)
                    ->orWhere('message', 'like', $term);
            });
        }

        $paginated = $query->paginate($filters['per_page'] ?? 15)->withQueryString();

        return response()->json([
            'data' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'from' => $paginated->firstItem(),
                'to' => $paginated->lastItem(),
            ],
            // Counts per status drive the filter tabs' badges, independent of the
            // active filter (so "New (3)" stays accurate while viewing Archived).
            'counts' => [
                'all' => Inquiry::count(),
                'new' => Inquiry::where('status', 'new')->count(),
                'read' => Inquiry::where('status', 'read')->count(),
                'archived' => Inquiry::where('status', 'archived')->count(),
            ],
            // Distinct services present in the data, for the service dropdown.
            'services' => Inquiry::query()->distinct()->orderBy('service')->pluck('service'),
        ]);
    }

    public function show(Inquiry $inquiry): JsonResponse
    {
        return response()->json(['data' => $inquiry]);
    }

    /** Change the triage status (new / read / archived). */
    public function update(Request $request, Inquiry $inquiry): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(Inquiry::STATUSES)],
        ]);

        $inquiry->update($data);

        return response()->json(['data' => $inquiry]);
    }

    public function destroy(Inquiry $inquiry): JsonResponse
    {
        $inquiry->delete();

        return response()->json(['message' => 'Inquiry deleted.']);
    }
}
