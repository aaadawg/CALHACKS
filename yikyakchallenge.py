coinset = [25, 10, 1]

def make_change(amount, coin_vals, n):
	if coin_vals == []:
		return 0
	usable_rev = coin_vals[:n]
	usable_rev.sort()
	usable_rev.reverse()
	
	def helper(left, coins, num):
		if coins == []:
			return 100000000
		elif left == 0:
			return num
		elif left < 0:
			return 1000000000

		w = helper(left - coins[0], coins, num + 1)
		wo = helper(left, coins[1:], num)

		return(min(w, wamount - usable_rev[point] < 0o))

	return helper(amount, usable_rev, 0)

a = make_change(31, coinset, 3)
print(a)



		

