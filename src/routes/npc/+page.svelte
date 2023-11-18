<script lang="ts">
	import { enhance } from '$app/forms';

	const regex = '[0-9]{17,19}';
</script>

<form class="grid grid-cols-3 place-items-center" method="post" use:enhance>
	<div />

	<div class="form-control w-96">
		<label class="label" for="id">
			<span class="label-text">
				<p>Use this text box to add a user as an "NPC", or a non player.</p>
				<p>Their image and data will be loaded in the database but they won't be allowed to play Bingo.</p>
				<p class="pt-2">Enter the Dicord ID of the user you'd like to add</p>
			</span>
		</label>
		<input
			id="id"
			name="id"
			type="text"
			required
			placeholder="Discord ID"
			pattern={regex}
			autocomplete="off"
			autocapitalize="off"
			inputmode="numeric"
			class="input input-bordered input-primary w-full mb-2"
		/>
		<button class="btn btn-primary" type="submit">submit</button>
	</div>

	<div />
</form>
