"use server";

interface GitHubRelease {
    tag_name: string;
}

export async function getLaunchVersion(): Promise<string> {
    try {
        const res = await fetch("https://api.github.com/repos/hexoran-org/releases/releases/latest", {
            next: { revalidate: 3600 }, // Cache for 1 hour
            headers: {
                "User-Agent": "Hexoran-Web-Client",
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch GitHub release:", res.status, res.statusText);
            return "V1.0 Stable Release"; // Fallback
        }

        const data: GitHubRelease = await res.json();
        return data.tag_name || "V1.0 Stable Release";
    } catch (error) {
        console.error("Error fetching release version:", error);
        return "V1.0 Stable Release"; // Fallback
    }
}
