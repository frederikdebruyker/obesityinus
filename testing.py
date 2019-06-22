def createSankeyInput(dic_in,obesity_keys,count_keys,names):
    mults = []
    outJSON = {"data":[{"name":"Obesity","to:":0,}],"links":[]}
    for i in range(len(names)):
    #      if i = "not_significant"
              
    #        else {
    #            values.push(0.0)
        mults.append(float(dic_in[obesity_keys[i]])*float(dic_in[count_keys[i]])/100)
        outJSON["nodes"].append({"node":(i+1),"name":names[i]})
        outJSON["links"].append({"source":0,"target":(i+1),"value":mults[i]})
    return outJSON