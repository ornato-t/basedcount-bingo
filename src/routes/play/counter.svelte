<script lang="ts">
	import { DateTime } from 'luxon';

	export let time: Date;

	let displayed = relativeDate(time);

	setInterval(() => (displayed = relativeDate(time)), 1000);

	function relativeDate(roundStart: Date) {
		const roundEnd = DateTime.fromJSDate(new Date(roundStart)).plus({ days: 7 });
		const difference = roundEnd.diff(DateTime.local(), ['seconds', 'minutes', 'hours', 'days']);

		return difference;
	}
</script>

<div class="flex gap-5">
	<div>
		<span class="countdown font-mono text-3xl">
			<span style="--value:{Math.round(displayed.days)};" />
		</span>
		days
	</div>
	<div>
		<span class="countdown font-mono text-3xl">
			<span style="--value:{Math.round(displayed.hours)};" />
		</span>
		hours
	</div>
	<div>
		<span class="countdown font-mono text-3xl">
			<span style="--value:{Math.round(displayed.minutes)};" />
		</span>
		min
	</div>
	<div>
		<span class="countdown font-mono text-3xl">
			<span style="--value:{Math.round(displayed.seconds)};" />
		</span>
		sec
	</div>
</div>
