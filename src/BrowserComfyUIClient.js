class BrownserComfyUIClient {
    constructor(serverAddress, clientId) {
        this.serverAddress = serverAddress;
        this.clientId = clientId;
        this.ws = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (this.ws) {
                this.disconnect();
            }
            const url = `ws://${this.serverAddress}/ws?clientId=${this.clientId}`;
            console.log(`Connecting to url: ${url}`);
            this.ws = new WebSocket(url);
            this.ws.binaryType = "arraybuffer";

            this.ws.onopen = () => {
                console.log("Connection open");
                resolve();
            };

            this.ws.onclose = () => {
                console.log("Connection closed");
            };

            this.ws.onerror = (err) => {
                console.error("WebSocket error:", err);
                reject(err);
            };
        });
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    onMessage(callback) {
        if (this.ws) {
            this.ws.onmessage = callback;
        }
    }

    async queuePrompt(prompt) {
        const res = await fetch(`http://${this.serverAddress}/prompt`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt,
                client_id: this.clientId
            })
        });
        const json = await res.json();
        if (json.error) {
            throw new Error(JSON.stringify(json));
        }
        return json;
    }

    async uploadImage(image, filename, overwrite) {
        const formData = new FormData();
        formData.append("image", new Blob([image]), filename);
        if (overwrite !== undefined) {
            formData.append("overwrite", overwrite.toString());
        }
        const res = await fetch(`http://${this.serverAddress}/upload/image`, {
            method: "POST",
            body: formData
        });
        const json = await res.json();
        if (json.error) {
            throw new Error(JSON.stringify(json));
        }
        return json;
    }

    async getImage(filename, subfolder, type) {
        const res = await fetch(
            `http://${this.serverAddress}/view?` + new URLSearchParams({
                filename,
                subfolder,
                type
            })
        );
        const blob = await res.blob();
        return blob;
    }

    async getHistory(promptId) {
        const res = await fetch(
            `http://${this.serverAddress}/history` + (promptId ? `/${promptId}` : "")
        );
        const json = await res.json();
        if (json.error) {
            throw new Error(JSON.stringify(json));
        }
        return json;
    }

    async getImages(prompt) {
        if (!this.ws) {
            throw new Error(
                "WebSocket client is not connected. Please call connect() before interacting."
            );
        }
        const queue = await this.queuePrompt(prompt);
        const promptId = queue.prompt_id;
        return new Promise((resolve, reject) => {
            const outputImages = {};
            const onMessage = async (event) => {
                if (event.data instanceof ArrayBuffer)
                    return;

                const data = event.data;
                try {
                    const message = JSON.parse(data);
                    if (message.type === "executing") {
                        const messageData = message.data;
                        if (!messageData.node) {
                            const donePromptId = messageData.prompt_id;
                            console.log(`Done executing prompt (ID: ${donePromptId})`);
                            if (messageData.prompt_id === promptId) {
                                const historyRes = await this.getHistory(promptId);
                                const history = historyRes[promptId];
                                for (const nodeId of Object.keys(history.outputs)) {
                                    const nodeOutput = history.outputs[nodeId];
                                    if (nodeOutput.images) {
                                        const imagesOutput = [];
                                        for (const image of nodeOutput.images) {
                                            const blob = await this.getImage(
                                                image.filename,
                                                image.subfolder,
                                                image.type
                                            );
                                            imagesOutput.push({
                                                blob,
                                                image
                                            });
                                        }
                                        outputImages[nodeId] = imagesOutput;
                                    }
                                }
                                this.ws.removeEventListener("message", onMessage);
                                return resolve(outputImages);
                            }
                        }
                    }
                } catch (err) {
                    return reject(err);
                }
            };
            this.ws.addEventListener("message", onMessage);
        });
    }

    async saveImages(response) {
        for (const nodeId of Object.keys(response)) {
            for (const img of response[nodeId]) {
                const arrayBuffer = await img.blob.arrayBuffer();
                const blob = new Blob([arrayBuffer]);
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = img.image.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
}

// Export the ComfyUIClient class
export default BrownserComfyUIClient;
