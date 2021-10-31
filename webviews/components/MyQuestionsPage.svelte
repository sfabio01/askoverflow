<script>
    import { screen, PAGE } from "./stores";
    import { decode } from "he";

    let questions = [];

    function navigateToHomePage() {
        screen.set(PAGE.home);
    }

    window.addEventListener("message", (event) => {
        const message = event.data;
        switch (message.type) {
            case "questions": {
                let ids = message.value;
                if (ids == []) return;
                let url = new URL(
                    "https://api.stackexchange.com/2.3/questions/" +
                        ids.join(";")
                );
                url.searchParams.set("site", "stackoverflow");

                const xhr = new XMLHttpRequest();
                xhr.addEventListener("load", function (event) {
                    let data = JSON.parse(xhr.responseText);
                    console.log(data);
                    if (xhr.status == 400) {
                        tsvscode.postMessage({
                            type: "onError",
                            value: data.error_message,
                        });
                    }
                    if (xhr.status == 200) {
                        questions = data.items;
                    }
                });

                xhr.open("GET", url.toString());
                xhr.send();
            }
        }
    });
    tsvscode.postMessage({ type: "onGetQuestions", value: "" });
</script>

<button on:click={navigateToHomePage}>back</button>
<h1>My questions</h1>
{#if questions.length == 0}
    <p>The questions you ask with this extension will appear here</p>
{/if}
{#each questions as question}
    <h3>
        {decode(question.title)}
        {#if question.is_answered}<span style="color: teal;">&#10004;</span
            >{/if}
    </h3>
    <a href={question.link}>{question.link}</a>
    <p style="font-weight: 300; font-size:smaller;">
        asked {new Date(question.creation_date * 1000).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "short", day: "numeric" }
        )}
    </p>
    <p style="font-weight: 300; font-size:smaller;">
        {question.answer_count} answer{#if question.answer_count != 1}s{/if}
    </p>
    <p style="font-weight: 300; font-size:smaller;">
        Viewed {question.view_count} time{#if question.view_count != 1}s{/if}
    </p>
    <br />
{/each}
