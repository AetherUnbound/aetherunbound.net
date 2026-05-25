# Repair on Speed Queen Dryer ATEE9AGP173TW01

I'm making this post in hopes that this record might be useful for others facing a similar issue!

## The Device

- [Speed Queen 27 Inch Electric Laundry Center with 3.42 cu. ft. Washer Capacity, 9 Wash Cycles, 7.0 cu. ft. Dryer Capacity, 7 Dryer Cycles and Electronic Touchpad Controls](https://www.ajmadison.com/cgi-bin/ajmadison/ATEE9AGP173TW01.html)
- Model: ATEE9AGP173TW01
- [Parts list](https://www.appliancepartspros.com/parts-for-speed-queen-atee9agp173tw01.html)

## The problem

This dryer that had worked for many years would occasionally have an issue where even on timed dry with "low" heat, the heating element would go full blast (often to the point of ruining clothes). Initially this was unpredictable and inconsistent - sometimes it would be fine and other times you could tell within minutes it would overheat.

In fact, the _exact_ problem we were facing (including down to the troubleshooting steps I mention below) are what [YouTube user Jaydee describes as well in this video](https://www.youtube.com/watch?v=7kV8hXw1J18)!

## Troubleshooting

Here's what we ruled out through troubleshooting:

- Exhaust thermistor - we replaced this because it was broken, but the issue persisted
- Shorted heating element - we performed continuity tests on the heating element and all came up clean

The overheating would happen _even when_ the dryer was in "no heat" mode. When listening to the dryer turn on, I heard a loud click from what I presumed to be the control panel relay sending power to heating element. This would happen immediately, under any heat setting. Since the washer worked fine and the control panel on the front worked fine, we presumed the issue was with the dryer output control board.

<p>
<img src="/images/blog/speed-queen-dryer-repair/old-control-board.jpg" alt="The control board we needed to replace"/> <br/> The control board we needed to replace
</p>

At this point, I was looking at the [AppliancePartsPros part listing for the dryer](https://www.appliancepartspros.com/dryer-cabinet-exhaust-parts-for-speed-queen-atee9agp173tw01.html), and identified the thing I was looking at as part 19 of this diagram. So I looked up the first part 19 I could find ([D517191P](https://partsdr.com/part/d517191p-output-control-board?model=ATEE9AGP173TW01)) and bought it. Now tell me, dear reader, why they would have **TWO PART 19s LISTED ON THE SITE**?? With one being significantly more expensive than the other, and no indication on _which_ to buy since they were both compatible with my dryer model.

<p>
<img src="/images/blog/speed-queen-dryer-repair/parts-online.jpg" alt="The confusing parts listing online"/> <br/> The confusing parts listing online
</p>

Sadly I didn't notice this until I actually went to install the damn thing. The cables all had similar spots on the new control board, but the board itself looked completely different than the one I pulled out.

<p>
<img src="/images/blog/speed-queen-dryer-repair/old-board-wiring.jpg" alt="A better look at the wiring of the old board"/> <br/> A better look at the wiring of the old board
</p>

<p>
<img src="/images/blog/speed-queen-dryer-repair/wrong-board.jpg" alt="Connector positions of the wrong board"/> <br/> Connector positions of the wrong board
</p>

And sure enough, as soon as I turned the dryer on...

<p>
<img src="/images/blog/speed-queen-dryer-repair/error-code.webp" alt="Error code from the wrong control board"/> <br/> Error code from the wrong control board
</p>

It was the wrong part after all!! According to the [full manual/troubleshooting guide](https://www.groupdynamics-laundry.com/mans_files/5/806221en.pdf), this is "Drive Board ID Error":

> This error will be displayed if after checking for drive board/front end control compatibility it is found not to match. Unpower machine to clear code. Change front end control to one for a frontload washer.
>
> - Wrong control has been put into machine. Verify correct part number.
> - If the package the part came in has the correct part number on it, contact the distributor the part was purchased from and let them know.

## The solution

What we _actually_ needed was that second listed part, [D513797P](https://partsdr.com/part/d513797p-output-control-assembly?model=ATEE9AGP173TW01) (of course the more expensive one). As soon as I installed this and plugged it all in, the thing worked like a charm! So this serves as a good note: **always double check to make sure the part you're buying visually matches what's currently in the machine**.
