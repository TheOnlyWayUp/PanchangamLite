<script>
	import { date, location, nakshatram, tarabalam_data } from '$lib/stores.js';
	import WelcomeModal from '$lib/components/WelcomeModal.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import {
		to_human_date,
		get_nakshatralu_compatability,
		compatability,
		is_in_time_range
	} from '$lib/utils.js';
	import { format, formatDistance, formatRelative, subDays } from 'date-fns';

	let current = [];
	let current_score = 0;
	let remaining_time = '';
	let loading = true;

	async function load_tarabalam_data_if_not_cached(break_cache = false) {
		loading = true;

		if (break_cache || $tarabalam_data[to_human_date($date)] == undefined) {
			let fetch_date = `${$date.getFullYear()}-${$date.getUTCMonth() + 1}-${$date.getDate()}`;
			let response = await fetch(`/?date=${btoa(fetch_date)}&city=${$location.split(' ')[0]}`);

			let data = await response.json();

			console.log(data);

			let nakshatralu = {};
			Object.entries(data['nakshatralu']).forEach((el) => {
				let [key, value] = el;
				let [start, end] = value.split('to');
				if (start && end) {
					// value exists and is not 'Nil' as per server
					nakshatralu[key] = {
						start: new Date(start),
						end: new Date(end),
						compatability: compatability[get_nakshatralu_compatability($nakshatram, key)],
						score: compatability[get_nakshatralu_compatability($nakshatram, key)]['score']
					};
					if (is_in_time_range(new Date(), nakshatralu[key]['start'], nakshatralu[key]['end'])) {
						current.push(nakshatralu[key]);
					}
				}
			});

			let good_times = {};
			Object.entries(data['good_times']).forEach((el) => {
				let [key, value] = el;
				let [start, end] = value.split('to');
				if (start && end) {
					// value exists and is not 'Nil' as per server
					good_times[key] = {
						start: new Date(`${to_human_date($date)} ${start}`),
						end: new Date(`${to_human_date($date)} ${end}`),
						score: 2
					};
					if (is_in_time_range(new Date(), good_times[key]['start'], good_times[key]['end'])) {
						current.push(good_times[key]);
					}
				}
			});

			let bad_times = {};
			Object.entries(data['bad_times']).forEach((el) => {
				let [key, value] = el;
				let [start, end] = value.split('to');
				if (start && end) {
					// value exists and is not 'Nil' as per server
					bad_times[key] = {
						start: new Date(`${to_human_date($date)} ${start}`),
						end: new Date(`${to_human_date($date)} ${end}`),
						score: -1
					};
					if (is_in_time_range(new Date(), bad_times[key]['start'], bad_times[key]['end'])) {
						current.push(bad_times[key]);
					}
				}
			});

			$tarabalam_data[to_human_date($date)] = {
				city: data['city'],
				good_times: good_times,
				bad_times: bad_times,
				nakshatralu: nakshatralu
			};
		}

		current.forEach((el) => {
			if (Math.abs(el.score) > current_score) {
				current_score = el.score;
				remaining_time = (el.end - new Date()) / 60000; // Thanks https://stackoverflow.com/a/24316516 !
				remaining_time = formatDistance(el.end, new Date(), { addSuffix: false });
			}
		});

		console.log('Data loaded', $tarabalam_data, current, current_score);

		loading = false;
		return $tarabalam_data[to_human_date($date)];
	}

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';

	onMount(async (e) => {
		await load_tarabalam_data_if_not_cached();
	});

	$: {
		$date;
		if (browser) {
			load_tarabalam_data_if_not_cached(); // Thanks https://stackoverflow.com/a/67810237 !
		}
	}
	$: {
		$location;
		if (browser) {
			load_tarabalam_data_if_not_cached(true);
		}
	}
</script>

<div class="flex min-h-screen flex-grow flex-col">
	<Header />

	<div class="flex-1">
		{#if new Date($date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)}
			<div transition:fade={{ delay: 100, duration: 100 }}>
				{#if current_score == 2}
					<div class="grid w-screen place-items-center bg-[#0f28b8] p-4 text-center">
						<div class="max-w-sm">
							<h1 class="text-3xl font-bold text-[#ffd700]">Excellent Time</h1>
							<p class="text-xl text-white">You have {remaining_time} left.</p>
							<p class="text-neutral-content">
								It's a great time to start something new, or to undertake a task with risk involved.
							</p>
						</div>
					</div>
				{:else if current_score == 1}
					<div class="grid w-screen place-items-center bg-[#283fc0] p-4 text-center">
						<div class="max-w-sm">
							<h1 class="text-3xl font-bold text-green-400">Good Time</h1>
							<p class="text-xl text-white">You have {remaining_time} left.</p>
							<p class="text-neutral-content">
								It's a great time to start something new, or to undertake a task with risk involved.
							</p>
						</div>
					</div>
				{:else if current_score == -1}
					<div
						class="text-neutral-content grid w-screen place-items-center bg-red-700 p-4 text-center"
					>
						<div class="max-w-sm">
							<h1 class="text-3xl font-bold text-amber-500">Bad Time</h1>
							<p class="text-xl">You have {remaining_time} left.</p>
							<p>Be careful, don't begin new or risky tasks.</p>
						</div>
					</div>
				{:else if current_score == -2}
					<div
						class="text-neutral-content grid w-screen place-items-center bg-red-900 p-4 text-center"
					>
						<div class="max-w-sm">
							<h1 class="text-3xl font-bold text-amber-700">Dangerous Time</h1>
							<p class="text-xl">You have {remaining_time} left.</p>
							<p>Be careful, don't begin new or risky tasks.</p>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		{#if !loading && $tarabalam_data[to_human_date($date)] != undefined}
			{@const data = $tarabalam_data[to_human_date($date)]}

			<div
				class="my-10 grid place-items-center space-y-5"
				transition:fade={{ delay: 100, duration: 100 }}
			>
				<div class="card bg-base-100 w-96 shadow-xl">
					<div class="card-body">
						<h2 class="card-title justify-center">Nakshatralu</h2>
						<div class="my-2 space-y-4">
							{#each Object.entries(data['nakshatralu']) as [current_nakshatram, metadata]}
								<div
									class:bg-slate-100={is_in_time_range(
										new Date(),
										metadata['start'],
										metadata['end']
									)}
								>
									<span class="font-bold">{current_nakshatram}</span> ({metadata['compatability'][
										'name'
									]}: <span class="font-semibold">{metadata['compatability']['status']}</span>):
									{format(metadata['start'], 'MMM do hh:mm a')}
									- {format(metadata['end'], 'MMM do hh:mm a')}
									{#if is_in_time_range(new Date(), metadata['start'], metadata['end'])}
										<span class="font-bold">CURRENT</span>
									{:else}
										<span
											class="tooltip underline"
											data-tip={format(metadata['start'], 'MMM do hh:mm a')}
											>({formatDistance(metadata['start'], new Date(), { addSuffix: true })})</span
										>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>
				<div class="card bg-base-100 w-96 shadow-xl">
					<div class="card-body">
						<h2 class="card-title justify-center">Good Times</h2>
						<div class="my-2 space-y-4">
							{#each Object.entries(data['good_times']) as [name, metadata]}
								<div
									class:bg-slate-100={is_in_time_range(
										new Date(),
										metadata['start'],
										metadata['end']
									)}
								>
									<span class="font-bold">{name}</span> :
									{format(metadata['start'], 'hh:mm a')}
									- {format(metadata['end'], 'hh:mm a')}
									{#if is_in_time_range(new Date(), metadata['start'], metadata['end'])}
										<span class="font-bold">CURRENT</span>
									{:else}
										<span
											class="tooltip underline"
											data-tip={format(metadata['start'], 'MMM do hh:mm a')}
											>({formatDistance(metadata['start'], new Date(), { addSuffix: true })})</span
										>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="card bg-base-100 w-96 shadow-xl">
					<div class="card-body">
						<h2 class="card-title justify-center">Bad Times</h2>
						<div class="my-2 space-y-4">
							{#each Object.entries(data['bad_times']) as [name, metadata]}
								<div
									class:bg-slate-100={is_in_time_range(
										new Date(),
										metadata['start'],
										metadata['end']
									)}
								>
									<span class="font-bold">{name}</span> :
									{format(metadata['start'], 'hh:mm a')}
									- {format(metadata['end'], 'hh:mm a')}
									{#if is_in_time_range(new Date(), metadata['start'], metadata['end'])}
										<span class="font-bold">CURRENT</span>
									{:else}
										<span
											class="tooltip underline"
											data-tip={format(metadata['start'], 'MMM do hh:mm a')}
											>({formatDistance(metadata['start'], new Date(), { addSuffix: true })})</span
										>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- --- -->

			<!-- --- -->
		{:else}
			<div class="m-10 flex-1">
				<h1 class="flex justify-center text-center text-3xl text-white">
					<div class="w-fit rounded-full bg-slate-700 p-4">
						<span class="animate-pulse" style="font-family: hindi;">ॐ</span>
					</div>
				</h1>
			</div>
		{/if}
	</div>

	<Footer />
	<WelcomeModal />
</div>
