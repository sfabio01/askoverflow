<script lang="ts">
    import { onMount } from "svelte";

    let title = "";
    let body = "";
    let tags = "";

    function postQuestion() {}

    onMount(() => {
        window.addEventListener("message", (event) => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                case "selectedCode":
                    body = body.concat("\n```\n", message.value, "\n```\n");
                    break;
            }
        });
    });
</script>

<h1>Ask a question</h1>
<label for="title"><b>Title</b></label>
<input
    id="title"
    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
    bind:value={title}
/>

<label for="body"><b>Body</b></label>
<textarea rows="15" id="body" style="resize: vertical;" bind:value={body} />
<p style="font-weight: 300;">```code``` **bold** *italic* >quote</p>

<label for="tags"><b>Tags</b></label>
<input id="tags" placeholder="e.g. (spring django laravel)" bind:value={tags} />

<button on:click={postQuestion}>post question</button>
