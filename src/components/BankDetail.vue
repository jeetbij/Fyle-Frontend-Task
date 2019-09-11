<template>
<div class="container" style="width: 100%;">
	<div class="row">
		<div class="col-md-12">
			<div class="col-md-2">
				 <div class="form-group">
					<select v-model="city" class="form-control">
						<option value="DELHI">Delhi</option>
						<option value="JAIPUR">Jaipur</option>
						<option value="MUMBAI">Mumbai</option>
						<option value="BANGALORE">Bangalore</option>
						<option value="CHENNAI">Chennai</option>
					</select>
				</div> 
			</div>
			<div class="col-md-7">
				<div class="input-group">
					<input v-model="search" type="text" class="form-control" placeholder="Search">
					<div class="input-group-btn">
						<button class="btn btn-default" type="button">
							<i class="glyphicon glyphicon-search"></i>
						</button>
					</div>
				</div>
			</div>
			<div class="col-md-2">
				<button class="btn btn-default" type="button" @click.prevent="mode=!mode">
					<span v-if="!mode">All Banks</span>
					<span v-else="">Favourites</span>
				</button>
			</div>
			<div class="col-md-1">
				 <div class="form-group">
					<select v-model="itemPerPage" class="form-control">
						<option value="25">25</option>
						<option value="50">50</option>
						<option value="100">100</option>
						<option value="150">150</option>
						<option value="200">200</option>
					</select>
				</div> 
			</div>
			<div class="col-md-12"><h3 v-if="mode" >All Banks</h3><h3 v-else="" >Favourites</h3></div>
			<div class="col-md-12 table-responsive">
				<table id="mytable" class="table table-bordred table-striped">   
					<thead>
						<th>Id</th>
						<th>Bank Name</th>
						<th>Branch</th>
						<th>IFSC</th>
						<th>Address</th>
						<th>City</th>
						<th>District</th>
						<th>State</th>
						<th>Action</th>
					</thead>
					
					<tbody>
						<tr v-for="(bank, index) in banks">
							<td>{{ bank.bank_id }}</td>
							<td>{{ bank.bank_name }}</td>
							<td>{{ bank.branch }}</td>
							<td>{{ bank.ifsc }}</td>
							<td>{{ bank.address }}</td>
							<td>{{ bank.city }}</td>
							<td>{{ bank.district }}</td>
							<td>{{ bank.state }}</td>
							<td v-if="isFavourite(bank.ifsc)"><p data-placement="top" data-toggle="tooltip" title="Favourite"><button @click.prevent="removeFromFavourite(bank.ifsc)" class="btn btn-primary btn-xs"><span style="color: yellow;" class="glyphicon glyphicon-star"></span></button></p></td>
							<td v-else=""><p data-placement="top" data-toggle="tooltip" title="Favourite"><button @click.prevent="addToFavourite(bank)" class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-star"></span></button></p></td>
						</tr>
					</tbody>    
				</table>
				<div v-if="isLoading"><i class="fas fa-spinner fa-spin fa-5x"></i></div>

				<div class="clearfix"></div>
				<ul class="pagination pull-right">
					<li :class="{disabled : currentPage<=1 }"><a @click.prevent="prevPage()"><span class="glyphicon glyphicon-chevron-left"></span></a></li>
					<li v-if="pagination.total > 1" v-for="index in pagination.total" :key="index" :class="{ active : index==currentPage}"><a @click.prevent="gotoPage(index)">{{index}}</a></li>
					
					<li :class="{disabled : currentPage>=pagination.total }"><a @click.prevent="nextPage()"><span class="glyphicon glyphicon-chevron-right"></span></a></li>
				</ul>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import { getBankDetail } from '../api';
export default {
	name: 'bank-detail',
	data: function () {
		return {
			allBank: [],
			banks: [],
			isLoading: false,
			itemPerPage: 50,
			pagination: {
				total: 0
			},
			currentPage: 1,
			city: 'DELHI',
			search: '',
			favourites: [],
			mode: true
		}
	},
	watch: {
		city: function() {
			this.getBanks(this.city)
		},
		search: function() {
			this.loading = true
			let q = this.search.toLowerCase()
			let temp = []
			if(this.mode) {
				temp = JSON.parse(localStorage.getItem(this.city.toLowerCase()))
			} else {
				temp = JSON.parse(localStorage.getItem('favourites'))
			}
			this.allBank = []
			this.banks = []
			this.pagination.total = 0

			this.allBank = temp.filter(function(bank) {
				if (bank.bank_name.toLowerCase().indexOf(q) > -1) return bank;
				if (bank.branch.toLowerCase().indexOf(q) > -1) return bank;
				if (bank.ifsc.toLowerCase().indexOf(q) > -1) return bank;
				if (bank.address.toLowerCase().indexOf(q) > -1) return bank;
				if (bank.city.toLowerCase().indexOf(q) > -1) return bank;
				if (bank.district.toLowerCase().indexOf(q) > -1) return bank;
				if (bank.state.toLowerCase().indexOf(q) > -1) return bank;
			})
			this.loadItem();
			this.loading = false;
		},
		mode: function() {
			if(this.mode) {
				this.getBanks(this.city);
			} else {
				this.allBank = this.favourites;
				this.loadItem();
			}
		},
		itemPerPage: function() {
			this.loadItem();
		}
	},
	methods: {
		init: async function(city) {
			this.isLoading = true;
			const res = await getBankDetail(city);
			if (res.status == 200) {
				this.allBank = res.data
				
				localStorage.setItem(city.toLowerCase(), JSON.stringify(this.allBank))
				
				this.loadItem();
				this.isLoading = false;
			} else {
				this.isLoading = false;
			}
		},
		loadItem: function() {
			this.pagination['total'] = Math.ceil(this.allBank.length/this.itemPerPage);
			this.banks = this.allBank.slice(0, this.itemPerPage);
		},
		gotoPage: function(page) {
			page = page-1;
			let start = page*this.itemPerPage
			this.banks = this.allBank.slice(start, start+this.itemPerPage)
			this.currentPage = page + 1
		},
		nextPage: function() {
			let start = this.currentPage*this.itemPerPage
			let end = start + this.itemPerPage
			this.banks = this.allBank.slice(start, end)
			this.currentPage = this.currentPage + 1
		},
		prevPage: function() {
			this.currentPage = this.currentPage - 1
			let start = this.currentPage*this.itemPerPage
			this.banks = this.allBank.slice(start-this.itemPerPage, start)
		},
		getBanks: function(city) {
			this.allBank = []
			this.banks = []
			this.pagination.total = 0
			if (localStorage.getItem(city.toLowerCase())) {
				this.isLoading = true;
				this.allBank = JSON.parse(localStorage.getItem(city.toLowerCase()))
				this.loadItem();
				this.isLoading = false;
			} else {
				this.init(city);
			}
		},
		addToFavourite: function(bank) {
			this.favourites.push(bank)
			this.saveFavourite()
		},
		removeFromFavourite: function(ifsc) {
			this.favourites = this.favourites.filter(function(bank){
				return bank.ifsc != ifsc;
			})
			this.saveFavourite()
			this.allBank = this.favourites;
			this.loadItem(); 
		},
		saveFavourite: function() {
			localStorage.setItem('favourites', JSON.stringify(this.favourites));
		},
		isFavourite: function(ifsc) {
			for (let i=0;i<this.favourites.length;i++) {
				if (this.favourites[i].ifsc == ifsc) {
					return true;
				}
			}
			return false;
		}
	},
	mounted() {
		this.getBanks(this.city);
		if (localStorage.getItem('favourites')) {
			this.favourites = JSON.parse(localStorage.getItem('favourites'))
		}
	}
}
</script>

<style scoped>
	td {
		text-align: left;
		max-width: 100px;
	}

	th {
		padding-left: 8px;
	}

	a {
		cursor: pointer;
	}
</style>