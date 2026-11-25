# Digital KYC Journey

A responsive digital Know Your Customer (KYC) onboarding experience built with Next.js, React and TypeScript.

The application guides users through a simulated identity verification journey, including device selection, document upload, selfie capture, liveness verification, face matching and final submission.

The experience supports desktop, tablet and mobile layouts, with a QR-code handoff flow allowing users to continue the verification journey on a mobile device.

## Features

- **KYC onboarding:** Welcome screen with estimated completion time and document requirements.
- **Device selection:** Continue on the current device or switch to a mobile device using a QR code.
- **Document verification:** Select and upload a passport, national ID or driver's licence.
- **Document validation:** Simulated document validation with success and failure states.
- **Selfie capture:** Capture a selfie using the device camera.
- **Liveness verification:** Simulated liveness checks.
- **Face matching:** Mocked face-matching service with success and failure handling.
- **Verification review:** Review verification details before submission.
- **Submission tracking:** Processing, completion and error states.
- **Session management:** Session creation, expiry monitoring and restart functionality.
- **Responsive design:** Layouts adapted for desktop, tablet and mobile.
- **Error handling:** Feedback and recovery paths for upload failures, camera permission issues, verification failures and session expiry.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React | Component-based user interface |
| TypeScript | Static typing |
| Tailwind CSS | Styling and responsive layouts |
| Redux Toolkit | KYC workflow and client-side state |
| TanStack Query (React Query) | Asynchronous operations and server-state management |
| Vitest | Unit and component testing |
| React Testing Library | Component behaviour and user interaction testing |

## Getting Started

### Prerequisites

- Node.js (Version 24+)
- npm

### Installation

Clone the repository and navigate into the project directory:

```bash
git clone <repository-url>
cd <project-directory>
```

Install dependencies:

```bash
npm install
```

### Run the application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Mobile Verification

The mobile verification journey is accessed through the QR-code handoff from the desktop experience.

The QR code contains a mobile verification URL with a session ID, allowing the user to continue the verification journey on a mobile device.

For this assessment, a predefined mock session ID is used to demonstrate the cross-device handoff flow. The mobile route requires a session ID; accessing it without one displays a session-required error.

In a production implementation, the session ID would be generated dynamically and securely associated with the user's verification session.

For camera functionality, use localhost during development or a secure HTTPS connection when accessing the application from another device.

```bash
http://localhost:3000/mobile-verification?sessionId=test-session-123
```

## Testing

Run the test suite:

```bash
npm run test:run
```

The test suite uses Vitest and React Testing Library to cover workflow state, services, components, session handling and verification flows.

## Project Structure

The application follows a feature-based structure, keeping related components, services and hooks together.

```text
src/
├── app/
│   ├── mobile-verification/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── features/
│   ├── device-selection/
│   ├── document-verification/
│   ├── face-matching/
│   ├── kyc-session/
│   ├── liveness-verification/
│   ├── review/
│   ├── selfie-verification/
│   └── verification-status/
│
├── lib/
│   └── providers/
│
├── store/
│   ├── slices/
│   ├── hooks.ts
│   ├── store.ts
│   └── storeProvider.tsx
│
└── test/
    ├── features/
    ├── services/
    ├── store/
    ├── config.test.ts
    └── setup.ts
```

### Architectural Overview

- **Feature-based organisation:** Each feature owns its relevant UI components, services and hooks.
- **Centralised workflow state:** Redux Toolkit manages the KYC journey and its transitions.
- **Server-state management:** TanStack Query (React Query) handles asynchronous service operations, loading states, errors and retries.
- **Shared providers:** Application-level providers configure Redux and TanStack Query.
- **Centralised tests:** Tests are organised under `src/test`, separate from feature code.

## State Management

The KYC journey is represented through distinct workflow stages:

- Idle
- Device Selection
- Document Upload
- Document Validation
- Selfie Capture
- Liveness Check
- Face Match
- Review
- Processing
- Complete
- Error

Redux Toolkit maintains the current workflow state and verification data. TanStack Query (React Query) manages asynchronous operations such as session creation, uploads, verification requests and submission.

This separation keeps application workflow state distinct from asynchronous service state.

## Mock Services and API Behaviour

The application does not contain real identity verification services. API interactions are simulated through service modules.

The mock services cover:

- KYC session creation.
- Document upload and validation.
- Selfie upload.
- Session status retrieval and expiry.
- Liveness verification.
- Face matching.
- Final verification submission.

Simulated responses allow the application to demonstrate successful and unsuccessful outcomes, including loading states, errors and retry behaviour.

## Assumptions

- External identity verification providers are represented by mock services.
- Document validation, OCR, liveness detection and facial matching are simulated.
- A predefined mock session ID is used to demonstrate the QR-based mobile handoff.
- The application is an assessment prototype and does not require a production backend or external identity verification provider.
- Camera access is used for selfie capture, subject to browser permissions.

## Technical Trade-offs

- **Redux Toolkit:** Selected to provide centralised and predictable management of the multi-stage KYC workflow.
- **TanStack Query (React Query):** Used to manage asynchronous operations, including loading states, errors and retries, separately from client-side workflow state.
- **Mock services:** Used instead of real APIs to demonstrate the verification journey without external service dependencies.
- **Feature-based architecture:** Chosen to keep functionality organised, maintainable and easier to extend.
- **Predefined session ID:** Used to demonstrate the cross-device handoff within the assessment scope rather than implementing a complete backend session exchange.

These decisions prioritise maintainability, clear separation of concerns and delivery within the assessment scope.

## Security Considerations and Limitations

This implementation is a front-end prototype, not a production ready KYC platform.

The following functionality is simulated or limited:

- No real OCR or document authenticity verification is performed.
- No real liveness detection or biometric face matching is performed.
- Mock services do not transmit identity documents or biometric information to an external verification provider.
- The predefined session ID is for demonstration purposes and does not provide production-grade session security.
- There is no production backend for persistent verification records or secure cross-device session management.

A production implementation would require additional security and infrastructure, including:

- Secure backend APIs and server-side session management.
- Authentication and authorisation for verification sessions.
- Secure document and biometric data storage and transmission.
- Expiring, single-use QR handoff tokens.
- Integration with trusted identity verification and biometric providers.
- Server-side validation, audit logging and monitoring.
- Compliance with applicable privacy and data protection requirements.

## Future Enhancements

Potential production extensions include integration with real document verification providers, secure cross-device session synchronisation, backend-driven verification status updates, persistent verification records and additional security testing.

---
