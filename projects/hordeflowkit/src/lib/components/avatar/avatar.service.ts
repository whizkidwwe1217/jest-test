import { HttpClient } from "@angular/common/http";

import { AVATAR_CONFIG } from "./avatar-config.token";
import { AvatarConfig } from "./avatar-config";
import { Injectable, Inject, Optional } from "@angular/core";
import { Observable } from "rxjs";

/**
 * list of Supported avatar sources
 */
const sources = [
  "FACEBOOK",
  "GOOGLE",
  "TWITTER",
  "VKONTAKTE",
  "SKYPE",
  "GRAVATAR",
  "GITHUB",
  "CUSTOM",
  "INITIALS",
  "VALUE"
];

/**
 * list of default colors
 */
const defaultColors = [
  "#1abc9c",
  "#3498db",
  "#f1c40f",
  "#8e44ad",
  "#e74c3c",
  "#d35400",
  "#2c3e50",
  "#7f8c8d"
];

/**
 * Provides utilities methods related to Avatar component
 */
@Injectable()
export class HfAvatarService {
  private _avatarColors: string[];

  constructor(
    @Optional()
    @Inject(AVATAR_CONFIG)
    private avatarConfig: AvatarConfig,
    private http: HttpClient
  ) {}

  /**
   * Get a random color.
   * The color is based on the ascii code of the given value.
   * This will guarantee that avatars with the same value
   * will have the same background color
   */
  getRandomColor(value: string): string {
    if (!value) return "transparent";
    const asciiCodeSum = this._calculateAsciiCode(value);
    const colors = this.getAvatarColors();
    return colors[asciiCodeSum % colors.length];
  }

  /**
   * Returns the list of supported avatar sources.
   */
  getSources(): string[] {
    return sources;
  }

  /**
   * Returns the list of defaul colors.
   */
  getDefaultColors(): string[] {
    return defaultColors;
  }

  /**
   * Returns a set of colors that will be used to fill the background color
   * of text avatars. If the user has provided a list of colors, Then this list
   * will be returned. Otherwise, the default colors will be used.
   *
   */
  getAvatarColors(): string[] {
    if (
      this.avatarConfig &&
      this.avatarConfig.avatarColors &&
      this.avatarConfig.avatarColors.length > 0
    ) {
      return this.avatarConfig.avatarColors;
    }
    return this.getDefaultColors();
  }

  /**
   * Get source priority
   * Facebook has the highest priority, Value has the lowest
   * @param source
   * @param avatarSources
   */
  getSourcePriority(source: string, avatarSources = sources) {
    return sources.indexOf(source.toUpperCase());
  }

  /**
   * Check if the given source is a valid avatar source or not.
   *
   * @param source
   */
  isSource(source: string): boolean {
    return sources.findIndex(item => item === source.toUpperCase()) > -1;
  }

  /**
   * return the sum of ascii code of the given string
   * @param value
   */
  _calculateAsciiCode(value: string) {
    return value
      .split("")
      .map(letter => letter.charCodeAt(0))
      .reduce((previous, current) => previous + current);
  }

  /**
   * Check wether the type of avatar is text or not.
   *
   * @param sourceType
   */
  isTextAvatar(sourceType: string): boolean {
    return ["INITIALS", "VALUE"].indexOf(sourceType) > -1;
  }

  /**
   * Retuns an Observable which is responisble of fetching async avatars
   * @param url of the avatar
   */
  fetchAvatar(avatarUrl: string): Observable<any> {
    return this.http.get(avatarUrl);
  }
}
