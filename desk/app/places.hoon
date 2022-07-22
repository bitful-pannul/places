::  places: mysterious locations from frens :) 
::
::  
::
/-  *places
/+  gossip, default-agent
::
::
/$  grab-place  %noun  %place
::
|%
+$  state-0
  $:  %0
      fresh=places  ::TODO  prune
  ==
::
+$  eyre-id  @ta
+$  card     card:agent:gall
--
::
=|  state-0
=*  state  -
::
%-  %+  agent:gossip
      [3 %anybody %anybody]
    %+  ~(put by *(map mark $-(* vase)))
      %place
    |=(n=* !>((grab-place n)))
^-  agent:gall
::
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
::
++  on-init
  ^-  (quip card _this)
  :_  this
  [%pass /eyre/connect %arvo %e %connect [~ /[dap.bowl]] dap.bowl]~
::
++  on-save  !>(state)
::
++  on-load
  |=  ole=vase
  ^-  (quip card _this)
  =/  old=state-0  !<(state-0 ole)
  [~ this(state old)]
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+  mark  (on-poke:def mark vase)
      %place
    =/  incoming  !<(place vase)
    :_  this(fresh (weld fresh ~[incoming]))  ::  modding state now 
    [(invent:gossip %place !>(incoming))]~
  ==
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?:  ?=([%http-response *] path)  [~ this]
  ?.  =(/~/gossip/source path)
    (on-watch:def path)
  :_  this
  %-  flop
  =|  n=@ud
  |-
  ::TODO  how does this affect data dissemination?
  ::NOTE  not really just locally-sourced data,
  ::      but that's probably the better behavior anyway.
  ?~  fresh  ~
  ?:  (gth n 7)  ~  :: how many n?
  :-  [%give %fact ~ %place !>(i.fresh)]
  $(fresh t.fresh, n +(n))
::
:: add another conditional to include places
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?.  ?&  =(/~/gossip/gossip wire)
          ?=(%fact -.sign)
          =(%place p.cage.sign)
      ==
    ~&  [dap.bowl %strange-sign wire sign]
    (on-agent:def wire sign)
  =+  !<(=place q.cage.sign)
  :-  ~
  ::TODO  notify if your @p is mentioned?
  =-  this(fresh -)
  |-  ^+  fresh
  ?~  fresh  [place ~]
  [i.fresh $(fresh t.fresh)] :: check for cord collision? 
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  (on-peek:def path)
    [%x %places %all ~]
    ``places+!>(fresh)
  ==
  ::TODO
  ::  /x/rumors
  ::  /x/rumor ? for frontend refresh button
::
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  ?+  sign-arvo  (on-arvo:def wire sign-arvo)
      [%eyre %bound *]
    ~?  !accepted.sign-arvo
      [dap.bowl 'eyre bind rejected!' binding.sign-arvo]
    [~ this]
  ==
::
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--

