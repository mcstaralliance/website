"use strict";

(function () {
    const timeoutTips = `
        <div class="col-md-2 col-sm-12 col-12">
            <div class="info-box">
                <span class="info-box-icon bg-info elevation-1">❌</span>
                <div class="info-box-content">
                    <span class="info-box-text text-red">Oops!</span>
                        <span class="info-box-number">无法连接至服务器</span>
                    </div>
                </div>
                <div class="ribbon-wrapper">
                    <div class="ribbon bg-red">Error</div>
                </div>
            </div>
        </div>`;

    function timeout(ms, promise) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error("Connect timeout"));
            }, ms);
            promise.then(resolve, reject);
        });
    }

    function buildPlayerElement(player) {
        const ribbonElement = player.ribbon === "" ? "" : `
            <div class="ribbon-wrapper">
                <div class="ribbon bg-${player.color}">${player.ribbon}</div>
            </div>
        `,
            verifiedElement = player.verified.show ? `<svg viewBox="0 0 24 24" fill="${player.verified.color}" style="height:1.25em"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>` : "",
            playerElement = `
            <div class="col-md-2 col-sm-12 col-12">
                <div class="info-box">
                    <span class="info-box-icon bg-info elevation-1">
                        <img src="https://skin.mcstaralliance.com/avatar/player/${player.name}" loading="lazy" alt="${player.name}" width="45" height="45">
                    </span>
                    <div class="info-box-content">
                        <span class="info-box-text text-${player.color}" title="${player.name}">${player.name} ${verifiedElement}</span>
                        <span class="info-box-number">${player.description}</span>
                    </div>
                    ${ribbonElement}
                </div>
            </div>
        `;

        return playerElement;
    }

    function handlePlayerNameList(data) {
        const players = [];

        data.forEach(name => {
            let description = "❤",
                color = "black",
                ribbon = "",
                priority = 0,
                verified = {
                    show: false,
                    color: "#3498db"
                };

            if (name.includes("[donator-tier1]")) {
                name = name.replace("[donator-tier1]", "");
                color = "green";
                ribbon = "Donator";
                priority = 10;
            } else if (name.includes("[donator-tier2]")) {
                name = name.replace("[donator-tier2]", "");
                color = "blue";
                ribbon = "Donator";
                priority = 20;
            } else if (name.includes("[donator-tier3]")) {
                name = name.replace("[donator-tier3]", "");
                color = "purple";
                ribbon = "Donator";
                priority = 30;
            }

            if (name.includes("[管理员]")) {
                name = name.replace("[管理员]", "");
                description = "管理员";
                color = "red";
                ribbon = "Admin";
                priority = 99;
                verified.show = true;
            }

            if (name.includes("[开发者]")) {
                name = name.replace("[开发者]", "");
                color = "orange";
                ribbon = "Dev";
                priority = 100;
                verified.show = true;
                verified.color = "#f1c40f";
            }

            players.push({
                name: name,
                description: description,
                color: color,
                ribbon: ribbon,
                priority: priority,
                verified: verified
            });
        });

        players.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        players.sort((a, b) => {
            return b.priority - a.priority;
        });

        return players;
    }

    timeout(5000, fetch("https://play.mcstaralliance.com:9001/onlinePlayers"))
        .then(response => response.json())
        .then(data => {
            document.querySelector("#player-list-s1").innerHTML = "";
            document.querySelector("#player-count-s1").textContent = `[繁星城] 当前有 ${data.length} 颗小星星在线`;

            const players = handlePlayerNameList(data);

            players.forEach(player => {
                document.querySelector("#player-list-s1").innerHTML += buildPlayerElement(player);
            });
        })
        .catch(err => {
            document.querySelector("#player-list-s1").innerHTML = timeoutTips;
        });

    timeout(5000, fetch("https://play.mcstaralliance.com:9002/onlinePlayers"))
        .then(response => response.json())
        .then(data => {
            document.querySelector("#player-list-s2").innerHTML = "";
            document.querySelector("#player-count-s2").textContent = `[聚星界] 当前有 ${data.length} 颗小星星在线`;

            const players = handlePlayerNameList(data);

            players.forEach(player => {
                document.querySelector("#player-list-s2").innerHTML += buildPlayerElement(player);
            });
        })
        .catch(err => {
            document.querySelector("#player-list-s2").innerHTML = timeoutTips;
        });

})();
