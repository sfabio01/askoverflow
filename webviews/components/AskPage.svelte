<script lang="ts">
    import { onMount } from "svelte";
    import {
        screen,
        PAGE,
        title,
        body,
        tags,
        isMounted,
        accessToken,
    } from "./stores";
    const key = "BS00p5ATAfS7dMN3HrcL9A((";

    function navigateToHomePage() {
        screen.set(PAGE.home);
    }

    async function postQuestion() {
        if ($accessToken == "") {
            tsvscode.postMessage({ type: "onAuth", value: "" });
            return;
        }
        if ($title.length < 15) {
            tsvscode.postMessage({
                type: "onInfo",
                value: "Title length must be greater then 15",
            });
            return;
        }
        if ($body.length < 30) {
            tsvscode.postMessage({
                type: "onInfo",
                value: "Body length must be greater then 30",
            });
            return;
        }

        let formData = new FormData();
        formData.append("title", $title);
        formData.append("body", $body);
        formData.append("tags", $tags);
        formData.append("key", key);
        formData.append("preview", "false");
        formData.append("site", "stackoverflow");
        formData.append("access_token", $accessToken);
        formData.append("filter", "default");

        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function (event) {
            let data = JSON.parse(xhr.responseText);
            // console.log(data);
            if (xhr.status == 400) {
                tsvscode.postMessage({
                    type: "onError",
                    value: data.error_message,
                });
                if (data.error_id == 403) {
                    // expired token
                    tsvscode.postMessage({
                        type: "onError",
                        value: "The authentication token is expired, please sign in again",
                    });
                    tsvscode.postMessage({ type: "onAuth", value: false });
                }
            }
            if (xhr.status == 200) {
                tsvscode.postMessage({
                    type: "onInfo",
                    value:
                        "Your question has been posted successfully.\n Link: " +
                        data.items[0].link,
                });
                title.set("");
                body.set("");
                tags.set("");
            }
        });
        xhr.open("POST", "https://api.stackexchange.com/2.3/questions/add");
        xhr.send(formData);
    }

    if (!$isMounted) {
        onMount(() => {
            window.addEventListener("message", (event) => {
                const message = event.data; // The json data that the extension sent
                switch (message.type) {
                    case "selectedCode": {
                        body.update((b) =>
                            b.concat("\n```\n", message.value, "\n```\n")
                        );
                        break;
                    }
                    case "token": {
                        accessToken.set(message.value);
                        break;
                    }
                }
            });

            tsvscode.postMessage({ type: "onAuth", value: true });
        });
        isMounted.set(true);
    }
</script>

<button on:click={navigateToHomePage}>back</button>
<h1>Ask a question</h1>
<label for="title"><b>Title</b></label>
<input
    id="title"
    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
    minlength="15"
    bind:value={$title}
/>

<label for="body"><b>Body</b></label>
<textarea
    rows="15"
    id="body"
    style="resize: vertical;"
    minlength="30"
    bind:value={$body}
/>

<p style="font-weight: 300;">```code``` **bold** *italic* >quote</p>

<label for="tags"><b>Tags</b></label>
<input
    id="tags"
    placeholder="e.g. (spring django laravel)"
    bind:value={$tags}
/>

<button on:click={postQuestion}>post question</button>

<p style="font-weight: 300;">
    <img
        alt="svgImg"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTYiIGhlaWdodD0iMTYiCnZpZXdCb3g9IjAgMCAyNCAyNCIKc3R5bGU9IiBmaWxsOiNmZmZmZmY7Ij4gICAgPHBhdGggZD0iTTEyLDJDNi40NzcsMiwyLDYuNDc3LDIsMTJzNC40NzcsMTAsMTAsMTBzMTAtNC40NzcsMTAtMTBTMTcuNTIzLDIsMTIsMnogTTEyLDE3TDEyLDE3Yy0wLjU1MiwwLTEtMC40NDgtMS0xdi00IGMwLTAuNTUyLDAuNDQ4LTEsMS0xaDBjMC41NTIsMCwxLDAuNDQ4LDEsMXY0QzEzLDE2LjU1MiwxMi41NTIsMTcsMTIsMTd6IE0xMi41LDloLTFDMTEuMjI0LDksMTEsOC43NzYsMTEsOC41di0xIEMxMSw3LjIyNCwxMS4yMjQsNywxMS41LDdoMUMxMi43NzYsNywxMyw3LjIyNCwxMyw3LjV2MUMxMyw4Ljc3NiwxMi43NzYsOSwxMi41LDl6Ij48L3BhdGg+PC9zdmc+"
    />
    You can use the <b>Insert code from current selection</b> command to append your
    code to the body of the question
</p>
