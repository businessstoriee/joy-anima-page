// src/pages/create/useCreate.ts
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { GreetingFormData, MediaItem, TextContent, EventType } from "@/types/greeting";
import { eventTypes } from "@/types/eventTypes";

export function useCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // refs
  const prevDefaultRef = useRef<string | null>(null);

  // user-edited texts flag
  const [textsEdited, setTextsEdited] = useState(false);

  // form state
  const [formData, setFormData] = useState<GreetingFormData>({
    eventType: "",
    senderName: "",
    receiverName: "",
    texts: [],
    media: [],
    audioUrl: '',
    videoUrl: "",
    videoPosition: { width: 400, height: 300 },
    animationStyle: "fade",
    layout: "grid",
    frameStyle: "classic",
    mediaAnimation: "fade",
    theme: "",
    backgroundSettings: {
      color: "#ffffff",
      gradient: { enabled: false, colors: ["#ffffff", "#000000"], direction: "to right" },
      animation: { enabled: false, type: "stars", speed: 3, intensity: 50 },
      pattern: { enabled: false, type: "dots", opacity: 20 },
    },
    emojis: [],
    borderSettings: {
      enabled: false,
      style: "solid",
      width: 2,
      color: "#000000",
      radius: 0,
      animation: { enabled: false, type: "none", speed: 3 },
      elements: [],
      decorativeElements: [],
    },
  });

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [customEvent, setCustomEvent] = useState<EventType | null>(null);

  // preview modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // keep previous injection behaviour: when eventType changes inject default text unless user edited
  useEffect(() => {
    if (!formData.eventType) return;

    const event = [...eventTypes, ...(customEvent ? [customEvent] : [])].find(
      (e) => e.value === formData.eventType
    );

    setSelectedEvent(event || null);

    const eventDefault = event?.defaultMessage || "";
    const currentFirstText = formData.texts?.[0]?.content;

    const shouldReplace =
      !currentFirstText ||
      !textsEdited ||
      currentFirstText === prevDefaultRef.current;

    if (event && shouldReplace) {
      setFormData((prev) => ({
        ...prev,
        texts: [
          {
            id: Date.now().toString(),
            content: eventDefault,
            style: {
              fontSize: "24px",
              fontWeight: "normal",
              color: "#333333",
              textAlign: "center",
            },
            animation: "fade",
          } as TextContent,
        ],
      }));

      // programmatic injection -> not user edited
      setTextsEdited(false);
    }

    prevDefaultRef.current = eventDefault;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.eventType, customEvent]);

  // input change (generic)
  function handleInputChange(field: string, value: any) {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (field === "eventType") {
        const event = [...eventTypes, ...(customEvent ? [customEvent] : [])].find((e) => e.value === value);

        // If selected predefined event, remove any custom event fields
        return {
          ...newData,
          theme: event?.theme || "",
          ...(value !== "custom" ? { customEventName: "", customEventEmoji: "" } : {}),
          texts:
            prev.texts && prev.texts.length > 0
              ? prev.texts
              : event
              ? [
                  {
                    id: Date.now().toString(),
                    content: event?.defaultMessage || "",
                    style: {
                      fontSize: "24px",
                      fontWeight: "normal",
                      color: "#333333",
                      textAlign: "center",
                    },
                    animation: "fade",
                  } as TextContent,
                ]
              : prev.texts,
        };
      }

      return newData;
    });
  }

  function handleMediaChange(newMedia: MediaItem[]) {
    setFormData((prev) => ({ ...prev, media: newMedia }));
  }

  function handleTextChange(newTexts: TextContent[]) {
    setFormData((prev) => ({ ...prev, texts: newTexts }));
    setTextsEdited(true);
  }

  // helper that builds a payload snapshot (used by preview and share)
  function buildPayloadForSharing() {
    const payload = {
      ...formData,
      ...(customEvent ? { customEventName: customEvent.label, customEventEmoji: customEvent.emoji } : {}),
      texts: formData.texts || [],
      media: formData.media || [],
      emojis: formData.emojis || [],
    };
    return payload;
  }

  function generateShareableURL() {
    if (!formData.eventType && !formData.customEventName && !customEvent) {
      toast({
        title: "Please select or create an event",
        description: "Event type is required to generate a sharable link.",
        variant: "destructive",
      });
      return;
    }

    const payload = buildPayloadForSharing();
    const params = new URLSearchParams();

    Object.entries(payload).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (Array.isArray(v) || typeof v === "object") {
        params.set(k, JSON.stringify(v));
      } else {
        params.set(k, String(v));
      }
    });

    if (customEvent) {
      params.set("customEventName", customEvent.label);
      params.set("customEventEmoji", customEvent.emoji);
    } else if (formData.customEventName) {
      params.set("customEventName", formData.customEventName);
      if (formData.customEventEmoji) params.set("customEventEmoji", formData.customEventEmoji);
    }

    const shareableURL = `${window.location.origin}/?${params.toString()}`;
    navigator.clipboard.writeText(shareableURL);
    toast({
      title: "Link copied!",
      description: "Sharable greeting URL has been copied to your clipboard.",
    });
  }

  function previewGreeting() {
    if (!formData.eventType && !formData.customEventName && !customEvent) {
      toast({
        title: "Please select or create an event",
        description: "Event type is required to preview the greeting.",
        variant: "destructive",
      });
      return;
    }

    const payload = buildPayloadForSharing();
    const params = new URLSearchParams();

    Object.entries(payload).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (Array.isArray(v) || typeof v === "object") {
        params.set(k, JSON.stringify(v));
      } else {
        params.set(k, String(v));
      }
    });

    if (customEvent) {
      params.set("customEventName", customEvent.label);
      params.set("customEventEmoji", customEvent.emoji);
    } else if (formData.customEventName) {
      params.set("customEventName", formData.customEventName);
      if (formData.customEventEmoji) params.set("customEventEmoji", formData.customEventEmoji);
    }

    navigate(`/?${params.toString()}`);
  }

  function handlePreviewClick() {
    if (!formData.eventType) {
      toast({
        title: "Please select an event type",
        description: "Event type is required to preview the greeting.",
        variant: "destructive",
      });
      return;
    }
    setIsPreviewOpen(true);
  }

  // custom event create handler (exposed to BasicDetailsForm)
  function onCustomEventCreate(newEvent: EventType) {
    setCustomEvent(newEvent);

    const injectedText: TextContent = {
      id: Date.now().toString(),
      content: newEvent.defaultMessage || "",
      style: {
        fontSize: "24px",
        fontWeight: "normal",
        color: "#333333",
        textAlign: "center" as const,
      },
      animation: "fade",
    };

    setFormData((prev) => {
      const shouldInjectDefaultText =
        !prev.texts || prev.texts.length === 0 || !textsEdited || prev.texts[0]?.content === prevDefaultRef.current;

      return {
        ...prev,
        eventType: "custom",
        customEventName: newEvent.label,
        customEventEmoji: newEvent.emoji,
        theme: newEvent.theme || prev.theme,
        texts: shouldInjectDefaultText ? [injectedText] : prev.texts,
      };
    });

    prevDefaultRef.current = newEvent.defaultMessage || "";
    setTextsEdited(false);
    setSelectedEvent(newEvent);
  }

  return {
    formData,
    setFormData,
    selectedEvent,
    customEvent,
    setCustomEvent,
    isPreviewOpen,
    setIsPreviewOpen,
    handleInputChange,
    handleMediaChange,
    handleTextChange,
    generateShareableURL,
    previewGreeting,
    handlePreviewClick,
    buildPayloadForSharing,
    onCustomEventCreate,
  };
}