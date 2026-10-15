<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// Public endpoint for the /contact page's inquiry form. Write-only from the
// outside: visitors can submit, but only the authenticated admin can read the
// submissions back (see Admin\InquiryController).
class InquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'service' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'budget' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'newsletter' => ['sometimes', 'boolean'],
        ]);

        $inquiry = Inquiry::create([
            ...$data,
            'newsletter' => (bool) ($data['newsletter'] ?? false),
            'status' => 'new',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Inquiry received.',
            'id' => $inquiry->id,
        ], 201);
    }
}
