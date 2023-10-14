<script lang="ts">
    import type { PageData } from "../$types";

    export let data: PageData;

    //on error it returns
    //https://basedcount-bingo.netlify.app/oauth?error=access_denied&error_description=The+resource+owner+or+authorization+server+denied+the+request&state=b5f67129-bd93-4e09-a425-068ed0cd77f9

    //on success it returns
    //https://basedcount-bingo.netlify.app/oauth?code=VvnBqZEq3TcG8j4Zwe1dxFnN1ojhVn&state=3f81934e-8b0c-4e91-ab04-06a0b9df7435
</script>

<div>
    Hello oauth. Got code: {data.code}
</div>