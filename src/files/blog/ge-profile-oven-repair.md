# Repair on GE Profile Oven P2S930SELSS

I'm making this post in hopes that this record might be useful for others facing a similar issue!
## The Device
- [GE Profile™ 30" Smart Dual Fuel Slide-In Front-Control Range](https://www.geappliances.com/appliance/GE-Profile-30-Smart-Dual-Fuel-Slide-In-Front-Control-Range-P2S930SELSS)
- Model: P2S930SELSS
- [Parts list](https://www.geapplianceparts.com/store/parts/assembly/P2S930SEL1SS)

## The situation
My wife and I were baking dinner in the oven when all of a sudden, the screen on the oven froze _while the oven was still running_. We couldn't use the screen OR the SmartHQ app to turn the oven off, and ended up having to turn it off at the breaker.

## Troubleshooting
Once it cooled down, I tried turning the breaker back on. The front screen would flash like it was starting up, but then go dead.

<p>
<img src="/images/blog/ge-profile-oven-repair/troubleshooting.jpg" alt="Troubleshooting the oven"/> <br/> The oven's odd startup screen
</p>

We had been told by an electrician recently that the power line under the house going to the oven looked superficially damaged, so I double checked the voltage coming out of the outlet for the range and confirmed that it was 220 (as expected).

We suspected that the heat from the oven might have fried the display board, and so we bought part [WB56X28190](https://partsdr.com/part/wb56x28190-glass-touch-control-board?model=P2S930SELSS). It took some work to get at this piece, we had to:
- Remove the range racks
- Pull the knobs off
- Remove the knob housings
- Remove the screws that secured the metal top of the range
- Remove all of the burners
- Unscrew the burner mounts from the metal top

<p>
<img src="/images/blog/ge-profile-oven-repair/open.jpg" alt="Oven with the top removed"/> <br/> The oven with the top removed
</p>

This allowed us to pull the front panel out and access the control board directly for replacement. We installed the new one, flipped the breaker...and got the same result. So it couldn't have been that board, even though we were certain this was some electrical issue.

## The solution
It turns out, this oven has _two_ control boards! Not just the $600 one up front which was now useless for us - there was a power control board [WB27X29501](https://partsdr.com/part/wb27x29501-control-board?model=P2S930SELSS) mounted on the back of the oven too. My girlfriend and I did some testing of the power being delivered to the front panel, and she determined that the board was not receiving one "leg" of power that it should have been. So we thought it might have been this next.

We pulled the oven out from the wall as far as we could to access the existing board. This one required removing a lot of screws, but not too many panels at least. And we took a picture of the existing module to make sure we knew where each of the cables were supposed to go (there were a lot).

<p>
<img src="/images/blog/ge-profile-oven-repair/wiring.jpg" alt="The power control board"/> <br/> The power control board
</p>

Once that was replaced and the breaker switched back on - voilà! The oven worked again!

<p>
<img src="/images/blog/ge-profile-oven-repair/repaired.jpg" alt="The oven working again"/> <br/> The oven working again!
</p>

Unfortunately, whatever we did to the control board made it so that the "remote enable" function does not stay on perpetually like it used to, which effectively makes it useless. But at least we have a functioning oven once more!
