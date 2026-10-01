//! Core types for Alibi: the verdict, the exhibits that prove each find,
//! and the reasons that tie a verdict to its exhibits.

use std::fmt;

/// The answer to "does their story hold up?".
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Verdict {
    HoldsUp,
    DoesntAddUp,
    RedFlags,
}

impl Verdict {
    /// The words shown on the verdict pill.
    pub fn label(self) -> &'static str {
        match self {
            Verdict::HoldsUp => "Holds up",
            Verdict::DoesntAddUp => "Doesn\u{2019}t add up",
            Verdict::RedFlags => "Red flags",
        }
    }

    /// Two or more contradictions are red flags. One contradiction, or any
    /// doubt, means the story doesn't add up. Otherwise it holds up.
    pub fn from_reasons(reasons: &[Reason]) -> Self {
        let count = |w: Weight| reasons.iter().filter(|r| r.weight == w).count();
        match (count(Weight::Contradicts), count(Weight::Doubt)) {
            (c, _) if c >= 2 => Verdict::RedFlags,
            (1, _) | (0, 1..) => Verdict::DoesntAddUp,
            _ => Verdict::HoldsUp,
        }
    }
}

/// How a single find bears on the story.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Weight {
    Supports,
    Doubt,
    Contradicts,
}

/// Exhibit numbers as shown in the case and the report: E1, E2, ...
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ExhibitId(pub u32);

impl fmt::Display for ExhibitId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "E{}", self.0)
    }
}

/// One find, saved the moment it was seen.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Exhibit {
    pub id: ExhibitId,
    pub title: String,
    pub url: String,
    /// RFC 3339, always UTC.
    pub captured_at: String,
    /// Hex SHA-256 of the saved snapshot.
    pub sha256: String,
    /// Wayback Machine copy, when the page could be archived.
    pub wayback: Option<String>,
}

impl Exhibit {
    /// The short form used in tables: first six and last four hex digits.
    pub fn short_hash(&self) -> String {
        let h = &self.sha256;
        if h.len() <= 10 {
            return h.clone();
        }
        format!("{}\u{2026}{}", &h[..6], &h[h.len() - 4..])
    }
}

/// A numbered reason under the verdict. A reason without exhibits is never shown.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Reason {
    pub text: String,
    pub weight: Weight,
    pub exhibits: Vec<ExhibitId>,
}

#[cfg(test)]
mod tests {
    use super::*;

    fn reason(weight: Weight) -> Reason {
        Reason {
            text: String::new(),
            weight,
            exhibits: vec![ExhibitId(1)],
        }
    }

    #[test]
    fn verdict_follows_the_reasons() {
        use Weight::*;
        assert_eq!(
            Verdict::from_reasons(&[reason(Supports), reason(Supports)]),
            Verdict::HoldsUp
        );
        assert_eq!(
            Verdict::from_reasons(&[reason(Supports), reason(Doubt)]),
            Verdict::DoesntAddUp
        );
        assert_eq!(
            Verdict::from_reasons(&[reason(Contradicts)]),
            Verdict::DoesntAddUp
        );
        assert_eq!(
            Verdict::from_reasons(&[
                reason(Contradicts),
                reason(Contradicts),
                reason(Contradicts)
            ]),
            Verdict::RedFlags
        );
        assert_eq!(Verdict::RedFlags.label(), "Red flags");
    }

    #[test]
    fn exhibits_print_like_the_report() {
        let e = Exhibit {
            id: ExhibitId(2),
            title: "Photo match, 3 profiles".into(),
            url: "image hash b3e1 0c7f 92aa".into(),
            captured_at: "2026-10-30T14:02:44Z".into(),
            sha256: "5c1e07d4f2a98b3c66e0d1f9a7b2c4e8f0a1b2c3d4e5f60718293a4b5c6d9b07".into(),
            wayback: None,
        };
        assert_eq!(e.id.to_string(), "E2");
        assert_eq!(e.short_hash(), "5c1e07\u{2026}9b07");
    }
}
