"use client";

import { forwardRef } from "react";
import maleUser from "../../../assets/icons/person/male_user.png";
import femaleUser from "../../../assets/icons/person/female_user.png";
import maleAdmin from "../../../assets/icons/person/male_admin.png";
import femaleAdmin from "../../../assets/icons/person/female_admin.png";
import { cn } from "../../utils";
import styles from "./WelkAvatar.module.css";
import type { WelkAvatarProps } from "./WelkAvatar.types";

const portraits = {
  user: maleUser,
  "male-user": maleUser,
  "female-user": femaleUser,
  "male-admin": maleAdmin,
  "female-admin": femaleAdmin,
};

export const WelkAvatar = forwardRef<HTMLSpanElement, WelkAvatarProps>(
  function WelkAvatar(
    {
      alt,
      src,
      icon,
      variant = "user",
      size = "md",
      className,
      color,
      style,
      growOnHover = false,
      ...props
    },
    ref,
  ) {
    const customIcon = !src && icon != null;

    return (
      <span
        {...props}
        ref={ref}
        role="img"
        aria-label={alt}
        className={cn(
          styles.avatar,
          styles[size],
          growOnHover && styles.growOnHover,
          className,
        )}
        style={{ backgroundColor: color, ...style }}
      >
        {customIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        ) : (
          <img
            className={cn(styles.image, !src && styles.portrait)}
            src={src ?? portraits[variant]}
            alt=""
            aria-hidden="true"
          />
        )}
      </span>
    );
  },
);
