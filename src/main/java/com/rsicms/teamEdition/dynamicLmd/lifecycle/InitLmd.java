package com.rsicms.teamEdition.dynamicLmd.lifecycle;

import java.io.IOException;

import javax.xml.transform.TransformerException;

import com.reallysi.rsuite.api.RSuiteException;
import com.reallysi.rsuite.api.extensions.ExecutionContext;
import com.reallysi.rsuite.api.extensions.Plugin;
import com.reallysi.rsuite.api.extensions.PluginLifecycleListener;
import com.rsicms.teamEdition.dynamicLmd.LmdConfigurationUtility;

public class InitLmd implements PluginLifecycleListener {

	@Override
	public void start(ExecutionContext context, Plugin plugin) {
		try {
			LmdConfigurationUtility lmdUtil = new LmdConfigurationUtility(context, plugin);
			lmdUtil.generatePlugin();
			lmdUtil.configureLmd();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TransformerException e) {
			e.printStackTrace();
		} catch (RSuiteException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void stop(ExecutionContext arg0, Plugin arg1) {
		// TODO Auto-generated method stub
		
	}

}
