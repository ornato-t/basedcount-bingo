<script lang="ts">
	const regex = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';
</script>

<form class="grid grid-cols-3 place-items-center" method="post">
	<div />

	<div class="form-control w-96">
		<label class="label" for="token">
			<span class="label-text">If you have been given a token, insert it here</span>
		</label>
		<input
			id="token"
			name="token"
			type="text"
			required
			placeholder="Token"
			pattern={regex}
			autocomplete="off"
			autocapitalize="off"
			class="input input-bordered input-primary w-full mb-2"
		/>
		<button class="btn btn-primary" type="submit">submit</button>
	</div>

	<div />
</form>
