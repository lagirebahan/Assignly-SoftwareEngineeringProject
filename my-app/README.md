my-app/
│
├── app/                         # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                 # Home (dashboard overview)
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── register/
│   │   └── page.tsx
│   │
│   ├── teams/
│   │   ├── page.tsx             # List of teams user joined
│   │   ├── [teamId]/
│   │   │   ├── page.tsx         # Team detail
│   │   │   ├── tasks/
│   │   │   │   └── page.tsx
│   │   │   └── verification/
│   │   │       └── page.tsx     # Leader-only page
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │
│   │   ├── teams/route.ts
│   │   ├── tasks/route.ts
│   │   ├── submissions/route.ts
│
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │
│   ├── teams/
│   │   ├── TeamCard.tsx
│   │   ├── CreateTeamModal.tsx
│   │
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── SubmitProgressModal.tsx
│   │
│   ├── verification/
│   │   ├── SubmissionCard.tsx
│   │   ├── CommentBox.tsx
│
├── lib/
│   ├── db.ts                    # Prisma or DB connection
│   ├── auth.ts                  # JWT/session logic
│   ├── validations.ts           # Zod schemas
│
├── types/
│   ├── user.ts
│   ├── team.ts
│   ├── task.ts
│   ├── submission.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useTeams.ts
│
├── middleware.ts                # Protect routes
│
├── prisma/                      # If using Prisma
│   └── schema.prisma
│
├── styles/
│   └── globals.css
│
├── tailwind.config.ts
├── tsconfig.json
└── package.json

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## notes utk home page(page.tsx)
Home page dijadiin default spawn pagenya, cuma pake JWT token nanti. so basically :
 - if baru pertama kali make, dia check token jwt, kl token kosong, dia di redirect ke login page. Tapi kl ada(expires every 14 days), dia bakal bypass login.

## notes for navbar
bikin semacam dropdown/popup di kanan pas pencet pfp, untuk buka list :
 - profile, (pfp change, name change, dll)
 - settings, (accessibility features?)
 - notif, (maybe make new page simple aja kek notif binusmaya )
 - logout, 

## possible idea for notif
sama bikin kl klik notif button(kl ada di navbar lgsg), small popup of 3-5 recent notifs, and then kl misalnya ada lebih banyak dia bisa "Manage Notifications..."(di pagenya bisa mark as read, delete)