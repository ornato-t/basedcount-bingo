<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="mx-auto">
	Hello oauth. Got these:
	<ul>
		<li>Name: {data.nick}</li>
		<li>Bio: {data.bio}</li>
		<li>Roles: {data.roles}</li>
		<li>Image: <img src="https://cdn.discordapp.com/avatars/{data.user.id}/{data.avatar ?? data.user.avatar}" alt="avatar"></li>
		<li>Banner: <img src="https://cdn.discordapp.com/avatars/{data.user.id}/{data.banner ?? data.user.banner}" alt="banner"></li>
	</ul>
</div>
