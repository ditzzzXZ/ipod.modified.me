"use client";
import { memo, useCallback, useState } from "react";
import * as SpotifyUtils from "utils/spotify";
import {
  AudioPlayerProvider,
  SettingsContext,
  SettingsProvider,
  useEffectOnce,
} from "hooks";
import { ClickWheel, ViewManager } from "components";
import {
  ScreenContainer,
  ClickWheelContainer,
  Shell,
  Sticker,
  Sticker2,
  Sticker3,
} from "components/Ipod/Styled";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpotifySDKProvider } from "providers/SpotifySdkProvider";
import { MusicKitProvider } from "providers/MusicKitProvider";
import ViewContextProvider from "providers/ViewContextProvider";
import { useRouter } from "next/navigation";
import { GlobalStyles } from "components/Ipod/GlobalStyles";
import Script from "next/script";

type Props = {
  appleAccessToken: string;
  /**
   * Used when the user is redirected back from Spotify's OAuth flow.
   * This is the code that is used to get the access token.
   */
  spotifyCallbackCode?: string;
  soundcloudUrl?: string; // 🔥 kita tambahin prop ini
};

const Ipod = ({ appleAccessToken, spotifyCallbackCode, soundcloudUrl }: Props) => {
  const router = useRouter();
  const queryClient = new QueryClient();
  const [isLoading, setIsLoading] = useState(true);

  const handleCheckSpotifyCallback = useCallback(
    async (code: string) => {
      await SpotifyUtils.handleSpotifyCode(code);
      setIsLoading(false);
      router.replace("/");
    },
    [router]
  );

  useEffectOnce(() => {
    if (spotifyCallbackCode) {
      handleCheckSpotifyCallback(spotifyCallbackCode);
      return;
    }
    setIsLoading(false);
  });

  if (isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <SettingsProvider>
        <ViewContextProvider>
          <SpotifySDKProvider>
            <MusicKitProvider token={appleAccessToken}>
              <AudioPlayerProvider>
                <SettingsContext.Consumer>
                  {([{ deviceTheme }]) => (
                    <Shell $deviceTheme={deviceTheme}>
                      <Sticker $deviceTheme={deviceTheme} />
                      <Sticker2 $deviceTheme={deviceTheme} />
                      <Sticker3 $deviceTheme={deviceTheme} />

                      {/* 🔥 Tambahin pemutar SoundCloud */}
                      {soundcloudUrl && (
                        <iframe
                          width="0"
                          height="0"
                          allow="autoplay"
                          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                            soundcloudUrl
                          )}&auto_play=true`}
                          style={{ display: "none" }}
                        ></iframe>
                      )}
                      {/* 🔥 Akhir tambahan */}

                      <ScreenContainer>
                        <ViewManager />
                      </ScreenContainer>
                      <ClickWheelContainer>
                        <ClickWheel />
                      </ClickWheelContainer>
                    </Shell>
                  )}
                </SettingsContext.Consumer>
              </AudioPlayerProvider>
            </MusicKitProvider>
          </SpotifySDKProvider>
        </ViewContextProvider>
      </SettingsProvider>
      <Script src="https://sdk.scdn.co/spotify-player.js" />
    </QueryClientProvider>
  );
};

export default memo(Ipod);
