"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#000000",
          "--normal-text": "#ffffff",
          "--normal-border": "rgba(255,255,255,0.12)",
          "--success-bg": "#000000",
          "--success-text": "#ffffff",
          "--success-border": "rgba(255,255,255,0.12)",
          "--error-bg": "#000000",
          "--error-text": "#ffffff",
          "--error-border": "rgba(255,255,255,0.12)",
          "--warning-bg": "#000000",
          "--warning-text": "#ffffff",
          "--warning-border": "rgba(255,255,255,0.12)",
          "--info-bg": "#000000",
          "--info-text": "#ffffff",
          "--info-border": "rgba(255,255,255,0.12)",
          "--border-radius": "0.75rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!font-mono !text-xs !tracking-wide !shadow-none",
          title: "!font-mono !text-xs !font-medium",
          description: "!font-mono !text-[11px] !opacity-60",
          actionButton: "!font-mono !text-[10px] !uppercase !tracking-widest",
          cancelButton: "!font-mono !text-[10px] !uppercase !tracking-widest",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
