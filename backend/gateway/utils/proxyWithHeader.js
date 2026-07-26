import proxy from "express-http-proxy"

export const proxyWithHeader = (serviceUrl) => {
    return proxy(serviceUrl, {
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
            }
            return proxyReqOpts
        },
        userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
            const allowedOrigins = [
                process.env.FRONTEND_URL,
                "https://cortexai-2.onrender.com",
                "http://localhost:5173"
            ].filter(Boolean);
            const origin = userReq.headers.origin;
            if (origin && allowedOrigins.includes(origin)) {
                headers['access-control-allow-origin'] = origin;
                headers['access-control-allow-credentials'] = 'true';
                headers['access-control-allow-headers'] = 'Content-Type, Authorization, x-user-id';
                headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            }
            return headers;
        }
    })
}