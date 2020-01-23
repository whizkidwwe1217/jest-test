import { HfAvatarService } from "./avatar.service";
import { AvatarConfig } from "./avatar-config";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HfAvatar } from "./avatar";
import { SourceFactory } from "./sources/source.factory";
import { AVATAR_CONFIG } from "./avatar-config.token";
import { HttpClientModule } from "@angular/common/http";
export * from "./avatar";
export * from "./sources/source";
export * from "./sources/source.factory";
export * from "./avatar-config";
export * from "./avatar.service";
export * from "./avatar-config.token";

@NgModule({
	imports: [CommonModule, HttpClientModule],
	declarations: [HfAvatar],
	providers: [SourceFactory, HfAvatarService],
	exports: [HfAvatar]
})
export class HfAvatarModule {
	static forRoot(avatarConfig: AvatarConfig): ModuleWithProviders {
		return {
			ngModule: HfAvatarModule,
			providers: [{ provide: AVATAR_CONFIG, useValue: avatarConfig }]
		};
	}
}
