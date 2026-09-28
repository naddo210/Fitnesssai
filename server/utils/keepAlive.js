import cron from 'node-cron';

/**
 * Initializes a background cron job to ping the server every 12 minutes.
 * This prevents free hosting platforms (like Render.com) from spinning down
 * the server after 15 minutes of inactivity.
 */
export const initKeepAliveCron = (port) => {
    // Schedule every 12 minutes (Render sleeps after 15 min of inactivity)
    cron.schedule('*/12 * * * *', async () => {
        const renderUrl = process.env.RENDER_EXTERNAL_URL;
        const serverUrl = process.env.SERVER_URL;
        const targetUrl = renderUrl || serverUrl;

        if (!targetUrl) {
            console.log(`[Keep-Alive Cron] Heartbeat check: Server running locally on port ${port}. (Set RENDER_EXTERNAL_URL or SERVER_URL in production for automated keep-alive pings)`);
            return;
        }

        try {
            const pingEndpoint = `${targetUrl.replace(/\/+$/, '')}/api/health`;
            console.log(`[Keep-Alive Cron] Sending heartbeat ping to ${pingEndpoint}...`);

            const startTime = Date.now();
            const res = await fetch(pingEndpoint);
            const latency = Date.now() - startTime;

            if (res.ok) {
                console.log(`[Keep-Alive Cron] ✅ Ping successful (${latency}ms) - Server kept active`);
            } else {
                console.warn(`[Keep-Alive Cron] ⚠️ Ping returned status ${res.status}`);
            }
        } catch (error) {
            console.error(`[Keep-Alive Cron] ❌ Heartbeat ping failed: ${error.message}`);
        }
    });

    console.log("⏱️ Keep-Alive cron job scheduled (every 12 minutes)");
};
