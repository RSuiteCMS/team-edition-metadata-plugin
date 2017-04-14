package com.rsicms.teamEdition.dynamicLmd.api;

import com.reallysi.rsuite.api.RestService;
import com.reallysi.rsuite.api.remoteapi.RemoteApiResult;
import com.reallysi.rsuite.api.remoteapi.result.RestResult;
import com.rsicms.pluginUtilities.SimpleRemoteApiHandler;
import com.rsicms.teamEdition.dynamicLmd.LmdConfigurationUtility;

@RestService(pattern = "team-edition:refreshLmd")
public class ForceLmdUpdate extends SimpleRemoteApiHandler {
	@Override
	public RemoteApiResult execute() throws Throwable {
		LmdConfigurationUtility lmdUtil = new LmdConfigurationUtility(context, plugin);
		lmdUtil.generatePlugin();
		lmdUtil.configureLmd();
		return new RestResult();
	}

}
