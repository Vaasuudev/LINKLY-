import React, { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { BACKEND_URL } from "../constants";

const Redirect_URL = () => {
    useEffect(() => {
        const handleRedirect = async () => {
            const currentUrl = window.location.href;
            const storedUrls = JSON.parse(localStorage.getItem('urls')) || [];
            const matchedUrl = storedUrls.find(url => url.shortUrl === currentUrl);

            if (matchedUrl) {
                window.location.href = matchedUrl.longUrl;
            } else {
                try {
                    const webId = currentUrl.substring(currentUrl.indexOf("linkly/") + "linkly/".length);
                    console.log(webId);
                    const response = await fetch(`${BACKEND_URL}/linkly/${webId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        window.location.href = data.oldLink;
                    } else {
                        console.error("Failed to increase viewer count");
                    }
                } catch (err) {
                    console.error("Error occurred while fetching the old link:", err);
                }
            }
        };

        handleRedirect();
    }, []);

    return (
        <div className="Loader_icon_1" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <FaSpinner className="loading-spinner" style={{ fontSize: "5em" }} />
            <div className="loading-text">
                <h1>loading...</h1>
            </div>
        </div>
    );
};

export default Redirect_URL;
