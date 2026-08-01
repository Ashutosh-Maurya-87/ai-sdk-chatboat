// import {
//     SignInButton,
//     SignOutButton,
//     SignUpButton,
//     SignIn,
//     SignedIn,
//     SignedOut
// } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";

// export const Navigation = () => {
//     return (
//         <nav className="border-b border-(--foreground)/10">
//             <div className="flex container h-16 items-center justify-between px-4  mx-auto">
//                 <div className="text-xl font-semibold">RAG Chatbot</div>

//                 <div className="flex gap-2">
//                     <SignedOut>
//                         <SignInButton mode="modal">
//                             <Button variant="ghost">Sign In</Button>
//                         </SignInButton>
//                         <SignUpButton mode="modal">
//                             <Button>Sign Up</Button>
//                         </SignUpButton>
//                     </SignedOut>

//                     <SignedIn>
//                         <SignOutButton>
//                             <Button variant="outline">Sign Out</Button>
//                         </SignOutButton>
//                     </SignedIn>
//                 </div>
//             </div>
//         </nav>
//     );
// };

"use client";

import {
    Show,
    SignInButton,
    SignUpButton,
    SignOutButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function Navigation() {
    return (
        <nav className="border-b border-foreground/10">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <h1 className="text-xl font-semibold">RAG Chatbot</h1>

                <div className="flex items-center gap-2">
                    <Show when="signed-out">
                        <SignInButton mode="modal">
                            <Button variant="ghost">
                                Sign In
                            </Button>
                        </SignInButton>

                        <SignUpButton mode="modal">
                            <Button>
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </Show>

                    <Show when="signed-in">
                        <SignOutButton>
                            <Button variant="outline">
                                Sign Out
                            </Button>
                        </SignOutButton>
                    </Show>
                </div>
            </div>
        </nav>
    );
}