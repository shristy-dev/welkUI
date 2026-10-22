"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../../utils";
import styles from "./WelkAttachment.module.css";
import type { WelkAttachmentProps } from "./WelkAttachment.types";

function accepts(file: File, accept: string) {
  return accept.split(",").some((entry) => {
    const rule = entry.trim().toLowerCase();
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith("/*"))
      return file.type.toLowerCase().startsWith(rule.slice(0, -1));
    return file.type.toLowerCase() === rule;
  });
}

function FilePreview({ file }: { file: File }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [failedFile, setFailedFile] = useState<File | null>(null);
  const kind = file.type.split("/")[0];
  const previewable = ["image", "video", "audio"].includes(kind);

  useEffect(() => {
    if (!previewable) return;
    const media = containerRef.current?.querySelector("img, video, audio");
    if (!media) return;
    const url = URL.createObjectURL(file);
    media.setAttribute("src", url);
    return () => {
      media.removeAttribute("src");
      URL.revokeObjectURL(url);
    };
  }, [file, previewable, kind]);

  if (!previewable) return null;

  return (
    <span className={styles.preview} ref={containerRef}>
      {kind === "image" ? (
        <img
          alt={`Preview of ${file.name}`}
          onError={() => setFailedFile(file)}
        />
      ) : kind === "video" ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption -- Local file previews have no supplied caption track.
        <video
          controls
          preload="metadata"
          aria-label={`Preview of ${file.name}`}
          onError={() => setFailedFile(file)}
        />
      ) : (
        // eslint-disable-next-line jsx-a11y/media-has-caption -- Local file previews have no supplied caption track.
        <audio
          controls
          preload="metadata"
          aria-label={`Preview of ${file.name}`}
          onError={() => setFailedFile(file)}
        />
      )}
      {failedFile === file && (
        <span className={styles.hint} role="status">
          Preview unavailable for {file.name}
        </span>
      )}
    </span>
  );
}

export const WelkAttachment = forwardRef<HTMLInputElement, WelkAttachmentProps>(
  function WelkAttachment(
    {
      label,
      maxFileSize,
      maxFiles,
      multiple = true,
      accept,
      onFilesChange,
      onChange,
      id,
      className,
      disabled,
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) {
    if (
      maxFileSize !== undefined &&
      (!Number.isFinite(maxFileSize) || maxFileSize <= 0)
    )
      throw new RangeError(
        "WelkAttachment: maxFileSize must be a positive finite byte count.",
      );
    if (maxFiles !== undefined && (!Number.isInteger(maxFiles) || maxFiles < 1))
      throw new RangeError(
        "WelkAttachment: maxFiles must be a positive integer.",
      );
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState("");
    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") return ref(node);
        if (ref) ref.current = node;
      },
      [ref],
    );

    useEffect(() => {
      const form = inputRef.current?.form;
      if (!form) return;
      const reset = (event: Event) =>
        queueMicrotask(() => {
          if (!event.defaultPrevented) {
            setFiles([]);
            setError("");
          }
        });
      form.addEventListener("reset", reset);
      return () => form.removeEventListener("reset", reset);
    });

    return (
      <div className={cn(styles.attachment, className)}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          {...props}
          ref={setRef}
          id={inputId}
          type="file"
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          className={styles.input}
          aria-describedby={[
            describedBy,
            `${inputId}-hint`,
            error && `${inputId}-error`,
          ]
            .filter(Boolean)
            .join(" ")}
          onChange={(event) => {
            const selected = Array.from(event.currentTarget.files ?? []);
            const limit = multiple ? maxFiles : 1;
            let problem = "";
            if (limit !== undefined && selected.length > limit)
              problem = `Choose no more than ${limit} file${limit === 1 ? "" : "s"}.`;
            else {
              const oversized = selected.find(
                (file) => maxFileSize !== undefined && file.size > maxFileSize,
              );
              const unsupported = accept?.trim()
                ? selected.find((file) => !accepts(file, accept))
                : undefined;
              if (oversized)
                problem = `${oversized.name} exceeds the ${maxFileSize}-byte limit.`;
              else if (unsupported)
                problem = `${unsupported.name} is not an accepted file type.`;
            }
            setError(problem);
            if (problem) event.currentTarget.value = "";
            const next = problem ? [] : selected;
            setFiles(next);
            onFilesChange?.(next);
            onChange?.(event);
          }}
        />
        <span className={styles.hint} id={`${inputId}-hint`}>
          {multiple ? "Choose one or more files." : "Choose one file."}
          {maxFiles !== undefined && ` Up to ${maxFiles} files.`}
          {maxFileSize !== undefined &&
            ` Maximum ${maxFileSize.toLocaleString()} bytes per file.`}
          {accept && ` Accepted: ${accept}.`}
        </span>
        {error && (
          <span className={styles.error} role="alert" id={`${inputId}-error`}>
            {error}
          </span>
        )}
        {files.length > 0 && (
          <>
            <ul className={styles.files} aria-label="Selected files">
              {files.map((file, index) => (
                <li key={index}>
                  <FilePreview file={file} />
                  <span>{file.name}</span>
                  <span className={styles.size}>
                    {file.size.toLocaleString()} bytes
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={styles.clear}
              disabled={disabled}
              onClick={() => {
                if (inputRef.current) inputRef.current.value = "";
                setFiles([]);
                setError("");
                onFilesChange?.([]);
              }}
            >
              Clear attachments
            </button>
          </>
        )}
      </div>
    );
  },
);
