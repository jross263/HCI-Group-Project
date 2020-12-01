ForEach ($core in 1..$NumberOfLogicalProcessors){ 
 
start-job -Name cpuStressTest1 -ScriptBlock{
    
    $result = 1;
    foreach ($loopnumber in 1..2147483647){
        $result=1;
        
        foreach ($loopnumber1 in 1..2147483647){
        $result=1;
            
            foreach($number in 1..2147483647){
                $result = $result * $number
            }
        }
    
            $result
        }
    }
}
Read-Host "Keep running until stop is pressed"