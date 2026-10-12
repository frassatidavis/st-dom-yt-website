import { T } from "../constants/theme";
import { Section, SectionTitle } from "../components/Section";
import PageHeader from "../components/PageHeader";
import PremiumPageActions from "../components/PremiumPageActions";
import Seo from "../components/Seo";
import Icon from "../components/Icon";
import { PHOTOS } from "../constants/photos";
import { getActiveSocial, PLATFORMS } from "../settings/store";
import { CONFIG } from "../constants/config";
import { ExternalLink } from "lucide-react";

const PLATFORM_ACCENTS = {
  Facebook: "#1877F2",
  Instagram: "#E4405F",
  YouTube: "#FF0000",
  Twitter: "#1DA1F2",
  TikTok: "#000000",
  LinkedIn: "#0A66C2",
  Other: T.burgundy,
};

function iconFor(platform) {
  return PLATFORMS.find((p) => p.value === platform)?.icon || "Globe";
}

export default function Connect() {
  const accounts = getActiveSocial();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Connect With Us"
        description="Follow St. Dominic Catholic Church on social media for daily updates, homilies, events, and parish life."
        image={PHOTOS.homeHero}
      />
      <PageHeader title="Connect With Us" variant="text" />
      <PremiumPageActions
        eyebrow="Stay in Touch"
        title="Choose the fastest way to connect"
        items={[
          {
            title: "Follow Our Parish",
            description: "Daily updates, homilies, events, and parish life.",
            href: "#social-links",
            icon: "Globe",
            primary: true,
          },
          {
            title: "Call the Office",
            description: CONFIG.phone,
            href: CONFIG.phoneLink,
            icon: "Phone",
          },
          {
            title: "Mass & Confession",
            description: "Plan your next visit around the weekly schedule.",
            to: "/mass-times",
            icon: "Church",
          },
        ]}
      />

      <Section id="social-links">
        <SectionTitle sub="Stay in Touch">Follow Our Parish</SectionTitle>
        <p
          className="u-lede"
          style={{
            fontSize: 16,
            color: T.warmGray,
            lineHeight: 1.8,
            margin: "0 0 48px",
            fontFamily: "var(--font-body)",
          }}
        >
          Check our Facebook page and Instagram for weekly videos, announcements, and important
          information from life at St. Dominic.
        </p>

        {accounts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              color: T.warmGray,
              fontFamily: "var(--font-body)",
            }}
          >
            <p>Social media accounts are being set up. Check back soon.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {accounts.map((acc) => {
              const accent = PLATFORM_ACCENTS[acc.platform] || T.burgundy;
              return (
                <a
                  key={acc.id}
                  href={acc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#fff",
                    border: `1px solid ${T.stone}`,
                    borderRadius: "var(--radius-card)",
                    padding: "24px 20px",
                    textDecoration: "none",
                    color: T.softBlack,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 12,
                    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.07)";
                    e.currentTarget.style.borderColor = accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = T.stone;
                  }}
                >
                  <Icon
                    name={iconFor(acc.platform)}
                    size={24}
                    color={`color-mix(in srgb, ${accent} 82%, ${T.softBlack})`}
                    style={{ flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        fontWeight: 600,
                        color: T.softBlack,
                        margin: "0 0 4px",
                      }}
                    >
                      {acc.platform}
                    </h3>
                    {acc.handle && (
                      <div
                        style={{
                          fontSize: 13,
                          color: accent,
                          fontWeight: 600,
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {acc.handle}
                      </div>
                    )}
                    {acc.description && (
                      <p
                        style={{
                          fontSize: 14,
                          color: T.warmGray,
                          lineHeight: 1.6,
                          margin: "8px 0 0",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {acc.description}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: T.warmGray,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Visit <ExternalLink size={12} />
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </Section>

      {/* Contact fallback */}
      <Section bg={T.cream}>
        <SectionTitle sub="Prefer to Call or Email?">In Person & By Phone</SectionTitle>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: T.charcoal,
            lineHeight: 1.9,
          }}
        >
          <p>
            <strong>{CONFIG.address}</strong>
            <br />
            {CONFIG.city}, {CONFIG.state} {CONFIG.zip}
          </p>
          <p>
            <a
              href={CONFIG.phoneLink}
              style={{ color: T.burgundy, fontWeight: 600, textDecoration: "none" }}
            >
              {CONFIG.phone}
            </a>
            {" · "}
            <a
              href={`mailto:${CONFIG.email}`}
              style={{ color: T.burgundy, fontWeight: 600, textDecoration: "none" }}
            >
              {CONFIG.email}
            </a>
          </p>
        </div>
      </Section>
    </div>
  );
}
