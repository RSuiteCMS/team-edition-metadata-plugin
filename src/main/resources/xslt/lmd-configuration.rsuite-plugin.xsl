<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fn="http://www.w3.org/2005/xpath-functions">
    <xsl:param name="current-date"/>
    <xsl:param name="plugin-id"/>
    <xsl:output
        encoding="UTF-8"
        indent="yes" />
    <xsl:template match="/">
        <rsuite-plugin>
            <xsl:attribute name="id"><xsl:value-of select="$plugin-id"/>-lmd-config</xsl:attribute>
            <xsl:attribute name="version" select="$current-date" />
            <xsl:apply-templates select="lmd-configuration" mode="extensionProviders"/>
        </rsuite-plugin>
    </xsl:template>
    <xsl:template match="lmd-configuration" mode="extensionProviders">
        <extensionProvider id="rsuite.Search">
            <xsl:apply-templates select="lmd-field" mode="definition" />
            <facetConfiguration>
                <xsl:apply-templates select="lmd-search" mode="facet-form"/>
            </facetConfiguration>
        </extensionProvider>
        <extensionProvider id="rsuite.Forms">
            <xsl:apply-templates select="lmd-edit" mode="utility-form"/>
            <xsl:apply-templates select="lmd-field" mode="datatype" />
            <datatypeDefinition formControlType="select" label="LMD Field" description="A list of configured LMD fields">
                <xsl:attribute name="name"><xsl:value-of select="$plugin-id" />:lmd-fields</xsl:attribute>
                <optionList>
                    <xsl:apply-templates select="lmd-field" mode="lmd-field-list" />
                </optionList>
            </datatypeDefinition>
        </extensionProvider>
        <extensionProvider id="rsuite.ContextMenu">
            <xsl:apply-templates select="lmd-edit" mode="context" />
        </extensionProvider>
    </xsl:template>
    <xsl:template match="lmd-field" mode="lmd-field-list">
        <option>
            <xsl:attribute name="label" select="@label" />
            <xsl:attribute name="value" select="@name" />
        </option>
    </xsl:template>
    <xsl:template match="lmd-edit" mode="menu-item">
        <menuItemList>
            <menuItem id="lmdEdit">
                <actionName>rsuite:editMetaData</actionName>
                <label><xsl:value-of select="@label" /></label>
                <xsl:choose><xsl:when test="@icon">
                    <property name="rsuite:icon">
                        <xsl:attribute name="value" select="@icon" />
                    </property>
                </xsl:when></xsl:choose>
                <property name="formId">
                    <xsl:attribute name="value"><xsl:value-of select="$plugin-id" />:metadata:<xsl:value-of select="@name" /></xsl:attribute>
                </property>
                <property name="rsuite:group" value="{$plugin-id}" />
                <property name="rsuite:path" value="Edit metadata" />
            </menuItem>
        </menuItemList>        
    </xsl:template>
    <xsl:template match="lmd-edit" mode="context">
        <xsl:variable name="appliesTo" select="/lmd-configuration/lmd-field[@name=current()/lmd-param/@ref]/applies-to" />
        <xsl:variable name="elements" select="$appliesTo/elements" />
        <xsl:variable name="containers" select="$appliesTo/containers" />
        <xsl:variable name="files" select="$appliesTo/files" />
        <xsl:choose>
            <xsl:when test="count($elements) > 0">
                <contextMenuRuleSet scope="allNodes">
                    <xsl:attribute name="id"><xsl:value-of select="$plugin-id" />:context:<xsl:value-of select="@name" /></xsl:attribute>
                    <xsl:apply-templates select="." mode="menu-item" />
                    <ruleList>
                        <xsl:variable name="elementNames">
                            <xsl:for-each select="$elements">
                                <el><xsl:choose><xsl:when test="@namespace-uri">{<xsl:value-of select="@namespace-uri" />}:</xsl:when></xsl:choose><xsl:value-of select="@local-name" /></el>
                            </xsl:for-each>
                        </xsl:variable>
                        <rule>include element <xsl:value-of select="fn:string-join(distinct-values($elementNames/el/text()), ',')" /></rule>
                    </ruleList>
                </contextMenuRuleSet>           
            </xsl:when>
        </xsl:choose>
        <xsl:choose>
            <xsl:when test="count($files) > 0">
                <contextMenuRuleSet scope="allNodes">
                    <xsl:attribute name="id"><xsl:value-of select="$plugin-id" />:context:<xsl:value-of select="@name" /></xsl:attribute>
                    <xsl:apply-templates select="." mode="menu-item" />
                    <ruleList>
                        <xsl:choose>
                            <xsl:when test="count(distinct-values($files/@extension)) > 0">
                                <rule>include fileExtension <xsl:value-of select="fn:string-join($files/@extension, ',')" /></rule>
                            </xsl:when>
                        </xsl:choose>
                        <rule>include element nonxml</rule>                        
                    </ruleList>
                </contextMenuRuleSet>                
            </xsl:when>
        </xsl:choose>
        <xsl:choose>
            <xsl:when test="count($containers) > 0">
                <contextMenuRuleSet scope="allNodes">
                    <xsl:attribute name="id"><xsl:value-of select="$plugin-id" />:context:<xsl:value-of select="@name" /></xsl:attribute>
                    <xsl:apply-templates select="." mode="menu-item" />
                    <ruleList>
                        <xsl:choose>
                            <xsl:when test="count(distinct-values($containers/@type)) > 0">
                                <!-- include CAs -->
                                <rule>include caType <xsl:value-of select="fn:string-join($containers/@type, ',')" /></rule>
                            </xsl:when>
                        </xsl:choose>
                        <rule>include element ca,canode</rule>
                    </ruleList>
                </contextMenuRuleSet>                
            </xsl:when>
        </xsl:choose>
    </xsl:template>
    <xsl:template match="lmd-field" mode="datatype">
        <xsl:choose>
            <xsl:when test="options">
                <datatypeDefinition baseType="string">
                    <xsl:attribute name="name"><xsl:value-of select="$plugin-id" />:datatype:<xsl:value-of select="@name" /></xsl:attribute>
                    <xsl:attribute name="formControlType"><xsl:value-of select="@control-type" /></xsl:attribute>
                    <xsl:attribute name="label"><xsl:value-of select="@label" /></xsl:attribute>
                    <xsl:attribute name="description"><xsl:value-of select="@description" /></xsl:attribute>
                    <xsl:apply-templates select="options" mode="datatype-options" />
                </datatypeDefinition>
            </xsl:when>
        </xsl:choose>
    </xsl:template>
    <xsl:template match="options" mode="datatype-options">
        <optionList>
            <xsl:apply-templates select="option" mode="datatype-option" />
        </optionList>
    </xsl:template>

    <xsl:template match="option" mode="datatype-option">
        <option>
            <xsl:attribute name="value" select="@value" />
            <xsl:choose>
                <xsl:when test="@label">
                    <xsl:attribute name="label" select="@label" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="label" select="@value" />
                </xsl:otherwise>
            </xsl:choose>
        </option>
    </xsl:template>
    <xsl:template match="lmd-field" mode="definition">
        <searchFieldDefinition name="@name" type="lmd-name-value">
            <xsl:attribute name="name"><xsl:value-of select="$plugin-id" />:field:<xsl:value-of select="@name" /></xsl:attribute>
            <description><xsl:value-of select="@label" /></description>
            <isFacet>true</isFacet>
            <componentList>
                <component>
                    <lmdName><xsl:value-of select="@name" /></lmdName>
                </component>
            </componentList>
        </searchFieldDefinition>
    </xsl:template>
    <xsl:template match="lmd-search" mode="facet-form">
        <facetFormConfig>
            <xsl:attribute name="id"><xsl:value-of select="$plugin-id" />:facet:<xsl:value-of select="@name" /></xsl:attribute>
            <xsl:choose><xsl:when test="@description"><xsl:attribute name="description" select="@description" /></xsl:when></xsl:choose>
            <xsl:choose><xsl:when test="@instructions"><xsl:attribute name="instructions" select="@instructions" /></xsl:when></xsl:choose>
            <xsl:choose><xsl:when test="@roles"><xsl:attribute name="roles" select="@roles" /></xsl:when></xsl:choose>
            <xsl:choose><xsl:when test="@label"><xsl:attribute name="label" select="@label" /></xsl:when><xsl:otherwise><xsl:attribute name="label" select="@name" /></xsl:otherwise></xsl:choose>
            <xsl:choose><xsl:when test="@icon">
                <property name="rsuite:icon">
                    <xsl:attribute name="value" select="@icon" />
                </property>
            </xsl:when></xsl:choose>
            <xsl:apply-templates select="lmd-param" mode="facet" />
        </facetFormConfig>
    </xsl:template>
    <xsl:template match="lmd-edit" mode="utility-form">
        <formDefinition>
            <xsl:attribute name="id"><xsl:value-of select="$plugin-id" />:metadata:<xsl:value-of select="@name" /></xsl:attribute>
            <xsl:choose><xsl:when test="@description"><xsl:attribute name="description" select="@description" /></xsl:when></xsl:choose>
            <xsl:choose><xsl:when test="@roles"><xsl:attribute name="roles" select="@roles" /></xsl:when></xsl:choose>
            <xsl:choose><xsl:when test="@label"><xsl:attribute name="label" select="@label" /></xsl:when><xsl:otherwise><xsl:value-of select="@name" /></xsl:otherwise></xsl:choose>
            <xsl:choose><xsl:when test="@icon">
                <property name="rsuite:icon">
                    <xsl:attribute name="value" select="@icon" />
                </property>
            </xsl:when></xsl:choose>
            <xsl:choose><xsl:when test="@instructions"><instructions><xsl:value-of select="@instructions" /></instructions></xsl:when></xsl:choose>
            <column name="metadata">
                <xsl:apply-templates select="lmd-param" mode="utility-field" />
            </column>
        </formDefinition>
    </xsl:template>
    <xsl:template match="lmd-param" mode="utility-field">
        <param>
            <name><xsl:value-of select="@ref" /></name>
            <label><xsl:value-of select="/lmd-configuration/lmd-field[@name=current()/@ref]/@label" /></label>
            <formControlType><xsl:value-of select="@control-type" /></formControlType>
            <xsl:choose>
                <xsl:when test="@allow-user-entry">
                    <allowUserEntry><xsl:value-of select="@allow-user-entry" /></allowUserEntry>
                </xsl:when>
                <xsl:otherwise>
                    <allowUserEntry>false</allowUserEntry>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:choose>
                <xsl:when test="@allow-multiple">
                    <allowMultiple><xsl:value-of select="@allow-multiple" /></allowMultiple>
                </xsl:when>
                <xsl:otherwise>
                    <allowMultiple>false</allowMultiple>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:choose>
                <xsl:when test="count(/lmd-configuration/lmd-field[@name=current()/@ref]/options/option) > 0">
                    <datatype>
                        <xsl:attribute name="name"><xsl:value-of select="$plugin-id" />:datatype:<xsl:value-of select="@ref" /></xsl:attribute>
                    </datatype>
                </xsl:when>
            </xsl:choose>
        </param>
    </xsl:template>
    <xsl:template match="lmd-param" mode="facet">
        <facet exactMatch="true">
            <xsl:attribute name="name"><xsl:value-of select="$plugin-id" />:field:<xsl:value-of select="@ref" /></xsl:attribute>
            <xsl:choose>
                <xsl:when test="@label">
                    <xsl:attribute name="label" select="@label" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="label" select="/lmd-configuration/lmd-field[@name=current()/@ref]/@label" />
                </xsl:otherwise>
            </xsl:choose>
            <xsl:choose>
                <xsl:when test="@control-type">
                    <xsl:attribute name="controlType" select="@control-type" />
                </xsl:when>
            </xsl:choose>
            <xsl:choose>
                <xsl:when test="@allow-user-entry">
                    <xsl:attribute name="allowUserEntry" select="@allow-user-entry" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="allowUserEntry" select="'false'" />
                </xsl:otherwise>
            </xsl:choose>
            <xsl:choose>
                <xsl:when test="@allow-multiple">
                    <xsl:attribute name="allowMultiple" select="@allow-multiple" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="allowMultiple" select="'false'" />
                </xsl:otherwise>
            </xsl:choose>
            <xsl:choose>
                <xsl:when test="count(/lmd-configuration/lmd-field[@name=current()/@ref]/options/option) > 0">
                    <xsl:attribute name="dataTypeName"><xsl:value-of select="$plugin-id" />:datatype:<xsl:value-of select="@ref" /></xsl:attribute>
                </xsl:when>
            </xsl:choose>
            <xsl:choose>
                <xsl:when test="@max-display">
                    <xsl:attribute name="maxDisplay" select="@max-display"/>
                </xsl:when>
            </xsl:choose>
        </facet>
    </xsl:template>
</xsl:stylesheet>