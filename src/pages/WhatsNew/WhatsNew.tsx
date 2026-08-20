import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GitBranch, GitCommitVertical, Sparkles, Wrench, TrendingUp } from "lucide-react";
import versionHistory from "../../data/versionHistory.json";
import CONSTANTS from "../../utils/constant/Constant";
import styles from "./style.module.css";

type ChangeType = "feature" | "fix" | "improvement";
type VersionType = "major" | "minor" | "patch";

interface VersionChange {
  type: ChangeType;
  text: string;
}

interface VersionEntry {
  version: string;
  date: string;
  type: VersionType;
  era: number;
  title: string;
  changes: VersionChange[];
  note?: string;
}

interface Era {
  id: number;
  title: string;
  range: string;
  description: string;
  color: string;
}

const changeIcon: Record<ChangeType, React.ReactNode> = {
  feature: <Sparkles size={13} />,
  fix: <Wrench size={13} />,
  improvement: <TrendingUp size={13} />,
};

const changeLabel: Record<ChangeType, string> = {
  feature: "New",
  fix: "Fix",
  improvement: "Improved",
};

const WhatsNew: React.FC = () => {
  const navigate = useNavigate();
  const { currentVersion, eras, versions } = versionHistory as {
    currentVersion: string;
    eras: Era[];
    versions: VersionEntry[];
  };

  const handleBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate(CONSTANTS.PROJECT_ROUTES.AUTHTICATION);
  };

  let lastEra: number | null = null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className={styles.headerTitle}>What&apos;s New</h1>
          <p className={styles.headerSub}>The story of Hisabkar, release by release</p>
        </div>
        <div className={styles.currentPill}>v{currentVersion}</div>
      </header>

      <main className={styles.content}>
        <div className={styles.timeline}>
          <div className={styles.line} />

          {versions.map((entry) => {
            const showEraHeader = entry.era !== lastEra;
            lastEra = entry.era;
            const eraMeta = eras.find((e) => e.id === entry.era);

            return (
              <React.Fragment key={entry.version}>
                {showEraHeader && eraMeta && (
                  <div className={styles.eraRow} style={{ "--era-color": `var(--hk-${eraMeta.color})` } as React.CSSProperties}>
                    <div className={styles.eraMarker}>
                      <GitBranch size={16} />
                    </div>
                    <div className={styles.eraCard}>
                      <span className={styles.eraRange}>{eraMeta.range}</span>
                      <h2 className={styles.eraTitle}>{eraMeta.title}</h2>
                      <p className={styles.eraDesc}>{eraMeta.description}</p>
                    </div>
                  </div>
                )}

                <div className={styles.entryRow}>
                  <div className={`${styles.marker} ${styles[entry.type]}`}>{entry.type === "major" ? <GitCommitVertical size={16} /> : null}</div>
                  <div className={styles.card}>
                    <div className={styles.cardHead}>
                      <span className={styles.version}>v{entry.version}</span>
                      <span className={`${styles.badge} ${styles[`badge-${entry.type}`]}`}>{entry.type}</span>
                      <span className={styles.date}>{entry.date}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{entry.title}</h3>
                    <ul className={styles.changeList}>
                      {entry.changes.map((change, idx) => (
                        <li key={idx} className={styles.changeItem}>
                          <span className={`${styles.changeIcon} ${styles[`icon-${change.type}`]}`}>{changeIcon[change.type]}</span>
                          <span>
                            <span className={styles.changeLabel}>{changeLabel[change.type]}</span>
                            {change.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {entry.note && <p className={styles.cardNote}>{entry.note}</p>}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default WhatsNew;
