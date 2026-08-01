"use client";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
    PromptInput,
    PromptInputBody,
    type PromptInputMessage,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import { Bot, User, Sparkles, FileText, ArrowRight } from "lucide-react";

export default function RAGChatbotPage() {
    const [input, setInput] = useState("");
    const { messages, sendMessage, status,
        // append, 
        // isLoading,
        error } = useChat();

    const handlePromptSubmit = (message: PromptInputMessage) => {
        // if (!message.text.trim() || isLoading) return;
        if (!message.text) return;
        sendMessage({
            text: message.text,
        });
        setInput("");
    };

    const handleQuickPrompt = (promptText: string) => {
        sendMessage({
            text: promptText,
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
            {/* Header */}
            <header className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Sparkles className="size-5" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-lg leading-none p-4">RAG Knowledge Assistant</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Ask questions backed by your document base
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Conversation Area */}
            <div className="flex-1 overflow-hidden relative rounded-xl border bg-card/50 shadow-sm flex flex-col">
                <Conversation className="h-full flex flex-col">
                    <ConversationContent className="p-4 sm:p-6 space-y-6">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full min-h-87.5 text-center p-6 space-y-6">
                                <div className="p-4 rounded-full bg-muted/50 border text-muted-foreground">
                                    <FileText className="size-8" />
                                </div>
                                <div className="max-w-sm space-y-2">
                                    <h2 className="font-semibold text-base">How can I help you today?</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Search through documentation, summarize complex topics, or ask direct queries.
                                    </p>
                                </div>

                                {/* Quick Prompts */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg text-left pt-2">
                                    {[
                                        "Summarize key takeaways from the documents",
                                        "What are the main security policies?",
                                        "How do I set up the environment?",
                                        "List all prerequisites mentioned in the docs",
                                    ].map((quickText, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleQuickPrompt(quickText)}
                                            className="group flex items-center justify-between p-3 text-xs rounded-lg border bg-background hover:bg-accent/50 hover:border-accent transition-all duration-150 text-muted-foreground hover:text-foreground"
                                        >
                                            <span className="truncate pr-2">{quickText}</span>
                                            <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Message List */
                            messages?.map((m, idx) => {
                                return <div key={idx}>
                                    {
                                        m.parts.map((part, partIdx) => {
                                            switch (part.type) {
                                                case "text":
                                                    return (
                                                        <Fragment key={partIdx}>
                                                            <Message
                                                                from={m.role}
                                                            className="text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm"
                                                            >
                                                                <MessageContent>
                                                                    <Response>{part.text}</Response>
                                                                </MessageContent>
                                                            </Message>
                                                        </Fragment>
                                                    );


                                                default:
                                                    return null;
                                            }
                                        })
                                    }
                                </div>
                            })
                        )
                        }
                        {
                            (status === "submitted" || status === 'streaming') && <Loader />
                        }


                    </ConversationContent>

                    <ConversationScrollButton className="bottom-20 right-6 shadow-md border" />
                </Conversation>

                {/* Prompt Input Section */}
                <div className="p-3 sm:p-4 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                    <PromptInput
                        onSubmit={handlePromptSubmit}
                        // isLoading={isLoading}
                        className="rounded-xl border shadow-sm focus-within:ring-1 focus-within:ring-ring"
                    >
                        <PromptInputBody>
                            <PromptInputTextarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}

                                placeholder="Ask a question about your documents..."
                                className="min-h-11 max-h-40 text-sm resize-none"
                            />
                            <PromptInputTools className="flex items-center justify-between pt-2">
                                <div className="text-[11px] text-muted-foreground">
                                    Press <kbd className="px-1 py-0.5 bg-muted rounded border text-[10px]">Enter</kbd> to send
                                </div>
                                <PromptInputSubmit disabled={!input.trim()} />
                            </PromptInputTools>
                        </PromptInputBody>
                    </PromptInput>
                </div>
            </div>
        </div>
    );
}