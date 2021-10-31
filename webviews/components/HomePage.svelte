<script lang="ts">
    import {
        screen,
        PAGE,
        searchResults,
        query,
        hasSearchedOnce,
    } from "./stores";
    import { decode } from "he";

    function navigateToAskPage() {
        screen.set(PAGE.ask);
    }
    function navigateToQuestionsPage() {
        screen.set(PAGE.questions);
    }

    async function onQueryChanged() {
        if ($query.length < 3) return;
        let url = new URL("https://api.stackexchange.com/2.3/search/advanced");
        url.searchParams.set("q", $query);
        url.searchParams.set("sort", "relevance");
        url.searchParams.set("site", "stackoverflow");
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function (event) {
            let data = JSON.parse(xhr.responseText);
            // console.log(data);
            if (xhr.status == 400) {
                tsvscode.postMessage({
                    type: "onError",
                    value: data.error_message,
                });
            }
            if (xhr.status == 200) {
                searchResults.set(data.items);
                hasSearchedOnce.set(true);
            }
        });

        xhr.open("GET", url.toString());
        xhr.send();
    }
</script>

<button on:click={navigateToAskPage}>Ask Question</button>
<button on:click={navigateToQuestionsPage}>My Questions</button>
<h1>Search on StackOverflow</h1>
<input
    id="query"
    placeholder="Search..."
    bind:value={$query}
    on:change={onQueryChanged}
/>
<p style="font-weight: 300;">Press 'Enter' to search</p>
{#if $hasSearchedOnce}
    <h2>
        {$searchResults.length} result{#if $searchResults.length != 1}s{/if} found
    </h2>
{/if}
{#each $searchResults as result}
    <h3>
        {decode(result.title)}
        {#if result.is_answered}<span style="color: teal;">&#10004;</span>{/if}
    </h3>
    <a href={result.link}>{result.link}</a>
    <p style="font-weight: 300; font-size:smaller;">
        asked {new Date(result.creation_date * 1000).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "short", day: "numeric" }
        )}
    </p>
    <br />
{/each}
