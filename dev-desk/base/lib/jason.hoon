|%
+$  places  (list place)
+$  place
    $|  [lat=@rd long=@rd desc=tape]  validate
::
++  validate
  |=  [lat=@rd long=@rd tape]
    ?&
      (gte:ma:rd lat .~-90)    (lte:ma:rd lat .~90)
      (gte:ma:rd long .~-180)  (lte:ma:rd long .~180)
    ==
::    
++  from-jason
  |=  jon=json
  %-  ot:dejs:format
  :~ 
    [%lat ne:dejs:format]
    [%long ne:dejs:format]
    [%desc sa:dejs:format]
  ==
--
