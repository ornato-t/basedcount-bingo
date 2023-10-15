<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';

	const DISCORD_LINK = 'https://discord.com/invite/fDnkukh6CF';
	const WEBSITE_LINK = 'https://basedcount.com';
	const LEMMY_LINK = 'https://lemmy.basedcount.com';
	const GITHUB_LINK = 'https://github.com/ornato-t/basedcount-bingo';
</script>

<svelte:head>
	<link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />

	<!-- COMMON TAGS -->
	<meta charset="utf-8" />
	<title>Based Count Bingo</title>
	<!-- Search Engine -->
	<meta name="description" content="Enter the fray of the Based Count Discord, where being terminally online is not a choice, but a challenge." />
	<meta name="image" content="https://basedcount-bingo.netlify.app/favicon.png" />
	<!-- Schema.org for Google -->
	<meta itemprop="name" content="Based Count Bingo" />
	<meta itemprop="description" content="Enter the fray of the Based Count Discord, where being terminally online is not a choice, but a challenge." />
	<meta itemprop="image" content="https://basedcount-bingo.netlify.app/favicon.png" />
	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Based Count Bingo" />
	<meta name="twitter:description" content="Enter the fray of the Based Count Discord, where being terminally online is not a choice, but a challenge." />
	<meta name="twitter:image:src" content="https://basedcount-bingo.netlify.app/favicon.png" />
	<!-- Open Graph general (Facebook, Pinterest & Google+) -->
	<meta name="og:title" content="Based Count Bingo" />
	<meta name="og:description" content="Enter the fray of the Based Count Discord, where being terminally online is not a choice, but a challenge." />
	<meta name="og:image" content="https://basedcount-bingo.netlify.app/favicon.png" />
	<meta name="og:url" content="https://basedcount-bingo.netlify.app/" />
	<meta name="og:site_name" content="Based Count Bingo" />
	<meta name="og:locale" content="en_GB" />
	<meta name="og:type" content="website" />
</svelte:head>

<nav class="navbar bg-base-100">
	<div class="navbar-start" />

	<div class="navbar-center">
		<a class="btn btn-ghost normal-case text-2xl cursor-pointer" href="/">Based Count Bingo</a>
	</div>

	<div class="navbar-end" />
</nav>

<main class="custom-full-size">
	<slot/>
</main>

<footer class="footer items-center p-4 text-neutral-content hidden md:grid">
	<nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
		<a href={DISCORD_LINK} class="btn btn-circle btn-ghost">
			<i class="bx bxl-discord-alt bx-sm" />
		</a>
		<a href={WEBSITE_LINK} class="btn btn-circle btn-ghost">
			<i class="bx bx-world bx-sm" />
		</a>
		<a href={LEMMY_LINK} class="btn btn-circle btn-ghost">
			<i class="bx bxs-conversation bx-sm" />
		</a>
		<a href={GITHUB_LINK} class="btn btn-circle btn-ghost">
			<i class="bx bxl-github bx-sm" />
		</a>
	</nav>
</footer>
