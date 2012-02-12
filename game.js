
enchant();

var game;

var money = new Group();
money.flag = false;
money.total = 0;
money.payTotal = 0;
money.en1 = 0;
money.en5 = 0;
money.en10 = 0;
money.en50 = 0;
money.en100 = 0;
money.en500 = 0;
money.en1000 = 0;
money.outCount = 0;


var rand = function(num){
	return Math.floor(Math.random()* num );
}

var arrayValueCount = function(array){
	var value = new Array();
	for(var i=0;i<array.length-1;i++){
		for(var j=i+1;j<array.length;j++){
			if(array[i] == array[j])
					value[array[i]]
		}
	}
}

var adden = function(num){
	var soundCoin = game.assets['coin.mp3'].clone();
	var soundPaper = game.assets['paper.mp3'].clone();
	if(num == 1000)
		var en = new Sprite(120,80);
	else if(num == 500)
		var en = new Sprite(70,70);
	else
		var en = new Sprite(50,50);
	en.num = num ;
	en.pick = false;
	en.image = game.assets[ num + 'en.png'];
	en.x = rand(200);
	en.y = rand(110) + 140;
	en.addEventListener('enterframe',function(e){
		if(money.flag == true){
			if(this.pick == true){
				//会計後消失処理
				if(this.num == 1)
					money.en1 --;
				else if(this.num == 5)
					money.en5 --;
				else if(this.num == 10)
					money.en10 --;
				else if(this.num == 50)
					money.en50 --;
				else if(this.num == 100)
					money.en100 --;
				else if(this.num == 500)
					money.en500 --;
				else if(this.num == 1000)
					money.en1000 --;

				money.removeChild(this);
			}
		}
	});
	en.addEventListener('touchstart',function(e){
			if(this.num == 1000)
				soundPaper.play();
			else
				soundCoin.play();

		if(this.pick == true){
			//会計トレー内の場合
			money.removeChild(this);
			this.x = rand(200);
			this.y = rand(110) + 140;
			money.addChild(this);
			money.payTotal -= this.num
			moneypick.text = 'お預かり金額 ' + money.payTotal + ' 円';
			this.pick = false;
    	} else {
			//財布内の場合
			money.flag = false;
			money.removeChild(this);
			this.x = rand(200)
			this.y = rand(70) + 30;
			money.addChild(this);
			money.payTotal += this.num;
			moneypick.text = 'お預かり金額 ' + money.payTotal + ' 円';
			this.pick = true;
    	}
	});
	money.addChild(en);
}

var myMoney = function(number){
	var num = number
	if(1000 <= num){
		adden(1000);
		num -= 1000;
		money.en1000 ++;
	}
	if(500 <= num){
		adden(500);
		num -= 500;
		money.en500 ++;
	}
	if(100 <= num){
		for(var i=0;i< Math.floor(num / 100);i++){
			adden(100);
			money.en100 ++;
		}
		num -= Math.floor(num / 100) * 100;
	}
	if(50 <= num){
		adden(50);
		num -= 50;
		money.en50 ++;
	}
	if(10 <= num){
		for(var j=0;j< Math.floor(num / 10);j++){
			adden(10);
			money.en10 ++;
		}
		num -= Math.floor(num / 10) * 10;
	}
	if(5 <= num){
		adden(5);
		num -= 5;
		money.en5 ++;
	}
	if(1 <= num){
		for(var k=0;k< Math.floor(num / 1);k++){
			adden(1);
			money.en1 ++;
		}
		num -= Math.floor(num / 1);
	}
}
var moneypick;

var message = function(value,n){
	var label = new Label();
	label.font = '1em"Ariar"';
	label.color = 'blue';
	label.x = 80;
	label.y = 50;
	if(value == 0)
		label.text = '丁度お預かりいたしました。';
	else if(value <= 1000 && value > 0)
		label.text = '<font size="3em" >' + value  + '</font> 円のお釣りになります。';
	else if(value > 1000)
		label.text = '<font size="3em">'+(value - 1000)+'</font> 円のお釣りと、<br />'
			+ '<font size="3em"> 1000円</font>の追加です。';
	else{
		label.color = 'red';
		label.y += 20 * money.outCount;
		label.text = value * -1 +' 円玉が' + n + ' 枚になってしまいました。';
	}
	label.addEventListener('enterframe',function(e){

		if(this.y <= 70)
			this.y ++;
		else
			game.rootScene.removeChild(this);
	});
	game.rootScene.addChild(label);
	if(value < 0)
		money.outCount ++;
}

window.onload = function() {
    game = new Game(320,320);
    game.fps = 24;
    game.time = 30;
    game.score = 0;
    game.preload('bg.png','shuffle.png','pay.png'
					,'1en.png','5en.png','10en.png','50en.png'
					,'100en.png','500en.png','1000en.png'
					,'se5.wav','se2.wav','shuffle.mp3','coin.mp3','paper.mp3');
    game.onload = function(){

		var bg = new Sprite(320,320);
		bg.image = game.assets['bg.png'];

		var soundEnd = game.assets['se5.wav'].clone();
		var soundShuffle = game.assets['shuffle.mp3'].clone();
		var soundClear = game.assets['se2.wav'].clone();

		var price = new Label();
		price.num = rand(1000);
		price.text = 'お会計 <font size="3em" >'
				+ price.num + '</font> 円になります。';

		money.total = rand(1000) + 1000;
		myMoney(money.total);

		moneypick= new Label();
		moneypick.x = 10;
		moneypick.y = 20;
		moneypick.text = 'お預かり金額 ' + money.payTotal + ' 円';

		var timeLabel = new Label();
		timeLabel.x = 250;
		timeLabel.text = game.time;
		timeLabel.addEventListener('enterframe',function(e){
			if(game.frame % game.fps == 0){
				if(game.time >= 0){
					this.text = game.time;
					game.time --;
				} else {
					game.end(game.score,game.score + '回成功して時間切れでした。');
					soundEnd.play();
				}
			}
		});

		var button = new Group();
		button.x = 220;
		button.y = 100;

		var buttonPay = new Sprite(100,50);
		buttonPay.image = game.assets['pay.png'];
		buttonPay.scaleX = 0.8;
		buttonPay.scaleY = 0.8;
		buttonPay.loopCount = 0;
		buttonPay.addEventListener('touchstart',function(e){
			if(price.num <= money.payTotal){
					//リトライ処理
					money.flag = true;
					money.total -= money.payTotal;
					money.payTotal -= price.num;
					if(money.payTotal + money.total <= 1000)
						money.payTotal += 1000;
					myMoney(money.payTotal);
					
					if(money.en1 >= 5)
						message(-1,money.en1);
					if(money.en5 >= 2)
						message(-5,money.en5);
					if(money.en10 >= 5)
						message(-10,money.en10);
					if(money.en50 >= 2)
						message(-50,money.en50);
					if(money.en100 >= 5)
						message(-100,money.en100);
					if(money.en500 >= 2)
						message(-500,money.en500);

					if(money.outCount == 0){
						soundClear.play();
						message(money.payTotal,0);
						money.total += money.payTotal;
						game.rootScene.addChild(money);

						if(game.score <= 20)
							game.time = 30 - game.score;
						else
							game.time = 10;
						game.score ++;
						money.payTotal = 0;
						moneypick.text = 'お預かり金額 ' + money.payTotal + ' 円';
						price.num = rand(1000);
						price.text = 'お会計 <font size="3em" >'
								+ price.num + '</font> 円になります。';
						game.rootScene.addChild(button);
					} else {
						game.end(game.score,game.score + '回成功して会計を間違えてしまいました。');
						soundEnd.play();
					}
			} else {
				game.end(game.score,game.score + '回成功してお金が足りませんでした。');
				soundEnd.play();
			}
		});
		button.addChild(buttonPay);

		var buttonShuffle = new Sprite(100,50);
		buttonShuffle.image = game.assets['shuffle.png'];
		buttonShuffle.scaleX = 0.8;
		buttonShuffle.scaleY = 0.8;
		buttonShuffle.y = 160;
		buttonShuffle.count = 0;
		buttonShuffle.addEventListener('touchstart',function(e){
			soundShuffle.play();
			for(var i=0;i<money.childNodes.length;i++){
				if(money.childNodes[i].pick == false){
					money.childNodes[i].y = rand(110) + 140;
					money.childNodes[i].x = rand(200);
				}
			}
			if(money.childNodes[this.count].pick == false)
				money.addChild(money.childNodes[this.count]);
			if(this.count == money.childNodes.length)
				this.count = 0;
			else
				this.count ++;
			game.rootScene.addChild(button);
		});
		button.addChild(buttonShuffle);

		game.rootScene.addChild(bg);
		game.rootScene.addChild(price);

		game.rootScene.addChild(moneypick);
		game.rootScene.addChild(timeLabel);
	    game.rootScene.addChild(money);
		game.rootScene.addChild(button);
        game.rootScene.backgroundColor = '#c1e4e9';
    }
    game.start();
};
