<script lang="ts">
    import { onMount } from "svelte";

    let accessToken = "";

    let title = "";
    let body = "";
    let tags = "";

    function postQuestion() {
        if (accessToken == "") {
            tsvscode.postMessage({ type: "onAuth", value: "" });
            return;
        }
        if (title.length < 15) {
            tsvscode.postMessage({
                type: "onInfo",
                value: "Title length must be greater then 15",
            });
            return;
        }
        if (body.length < 30) {
            tsvscode.postMessage({
                type: "onInfo",
                value: "Body length must be greater then 30",
            });
            return;
        }
        fetch(
            "https://api.stackexchange.com/docs/create-question#title=" +
                title.replaceAll(" ", "%20") +
                "&body=" +
                body.replaceAll(" ", "%20") +
                "&tags=" +
                tags.replaceAll(" ", "%20") +
                "&key=BS00p5ATAfS7dMN3HrcL9A((&preview=true&filter=default&site=stackoverflow&access_token=" +
                accessToken,
            {
                method: "POST",
                mode: "no-cors",
            }
        ).then(
            async (res) => {
                let json = await res.json();
                console.log(json);
                tsvscode.postMessage({
                    type: "onInfo",
                    value: "Question posted",
                });
            },
            (err) => {
                tsvscode.postMessage({
                    type: "onError",
                    value: "Question not posted",
                });
                console.log(err);
            }
        );
    }

    onMount(() => {
        window.addEventListener("message", (event) => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                case "selectedCode": {
                    body = body.concat("\n```\n", message.value, "\n```\n");
                    break;
                }
                case "token": {
                    accessToken = message.value;
                    break;
                }
            }
        });

        tsvscode.postMessage({ type: "onAuth", value: "" });
    });
</script>

<h1>Ask a question</h1>
<label for="title"><b>Title</b></label>
<input
    id="title"
    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
    minlength="15"
    bind:value={title}
/>

<label for="body"><b>Body</b></label>
<textarea
    rows="15"
    id="body"
    style="resize: vertical;"
    minlength="30"
    bind:value={body}
/>
<p style="font-weight: 300;">```code``` **bold** *italic* >quote</p>

<label for="tags"><b>Tags</b></label>
<input id="tags" placeholder="e.g. (spring django laravel)" bind:value={tags} />

<button on:click={postQuestion}>post question</button>
