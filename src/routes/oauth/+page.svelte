<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<ul>
	<li>Name: {data.discord.nick}</li>
	<li>Discord ID: {data.discord.user.id}</li>
	<li>Internal ID: {data.id}</li>
	<li>Bio: {data.discord.bio}</li>
	<li>Roles: {data.discord.roles}</li>
	<li>Image: <img src="https://cdn.discordapp.com/avatars/{data.discord.user.id}/{data.discord.avatar ?? data.discord.user.avatar}" alt="No avatar available"></li>
	<li>Banner: <img src="https://cdn.discordapp.com/avatars/{data.discord.user.id}/{data.discord.banner ?? data.discord.user.banner}" alt="No banner available"></li>
</ul>
