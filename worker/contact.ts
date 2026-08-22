import type { Env } from "./env";

interface ContactParams {
    turnstileToken?: string;
    company?: string;
    name?: string;
    email?: string;
    category?: string;
    message?: string;
    privacy?: boolean;
}

interface TurnstileResponse {
    success: boolean;
}

export default async function handleContactRequest(request: Request, env: Env): Promise<Response> {
    const allowedOrigins = [
        "https://acterware.com",
        "https://www.acterware.com",
    ];

    const origin = request.headers.get("Origin");
    const validOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    const corsHeaders: Record<string, string> = {
        "Access-Control-Allow-Origin": validOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const params = (await request.json()) as ContactParams;

        // --- Turnstile トークン検証 ---
        const turnstileToken = params.turnstileToken;
        if (!turnstileToken) {
            return new Response(JSON.stringify({ error: "ボット確認が未完了です" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                secret: env.TURNSTILE_SECRET,
                response: turnstileToken,
            }),
        });

        const verifyData = (await verifyRes.json()) as TurnstileResponse;
        if (!verifyData.success) {
            return new Response(JSON.stringify({ error: "ボット確認に失敗しました" }), {
                status: 403,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        // --- フォームデータ取得 ---
        const company = params.company || "未入力";
        const name = params.name || "未入力";
        const email = params.email || "未入力";
        const category = params.category || "未入力";
        const message = params.message || "未入力";
        const privacyAgreement = params.privacy ? "同意する" : "未同意";

        const categoryMap: Record<string, string> = {
            "strategist": "ITストラテジスト サービスについて",
            "system": "システム構築・PM支援について",
            "saas": "新規事業・SaaS立ち上げについて",
            "consulting": "業務改善・経営コンサルティングについて",
            "organization": "組織開発マネジメントについて",
            "other": "その他"
        };
        const categoryName = categoryMap[category] || category || "未選択";

        // --- 管理者宛て通知メール ---
        const to = "tsuda.takeshi@acterware.com";
        const frm = "info@acterware.com";
        const repTo = "info@acterware.com";
        const subject = `【アクターウェア Webサイト】お問い合わせがありました`;
        const body =
            "アクターウェア Webサイトより、新しいお問い合わせがありました。\n\n" +
            "---------------------------------------\n" +
            "■貴社名: " + company + "\n" +
            "■お名前: " + name + "様\n" +
            "■メールアドレス: " + email + "\n" +
            "■ご相談カテゴリ: " + categoryName + "\n" +
            "■プライバシーポリシー: " + privacyAgreement + "\n" +
            "■お問い合わせ内容:\n" + message + "\n" +
            "---------------------------------------\n\n" +
            "※このメールはシステムからの自動送信です。";

        const adminRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: frm,
                to: to,
                reply_to: repTo,
                subject: subject,
                text: body,
            }),
        });

        if (!adminRes.ok) {
            const error = await adminRes.text();
            return new Response(JSON.stringify({ error }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        // --- 問い合わせした人宛て控えメール ---
        const userSubject = `【アクターウェア】お問い合わせありがとうございます`;
        const userBody =
            name + "様\n\n" +
            "この度は、アクターウェアへお問い合わせいただき、誠にありがとうございます。\n" +
            "以下の内容でお問い合わせを受け付けました。後ほど担当者よりご連絡いたします。\n\n" +
            "---------------------------------------\n" +
            "■貴社名: " + company + "\n" +
            "■お名前: " + name + "様\n" +
            "■メールアドレス: " + email + "\n" +
            "■ご相談カテゴリ: " + categoryName + "\n" +
            "■お問い合わせ内容:\n" + message + "\n" +
            "---------------------------------------\n\n" +
            "※このメールはシステムからの自動送信です。\n" +
            "※お心当たりのない場合は、お手数ですが info@acterware.com までご連絡ください。";

        const userRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: frm,
                to: email,
                reply_to: repTo,
                subject: userSubject,
                text: userBody,
            }),
        });

        if (!userRes.ok) {
            const error = await userRes.text();
            return new Response(JSON.stringify({ error }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }
}
