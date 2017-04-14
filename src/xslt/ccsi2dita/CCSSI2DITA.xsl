<?xml version="1.0" encoding="iso-8859-1"?>

<xsl:stylesheet version="2.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output doctype-public="urn:pubid:eleducation.org:doctypes:dita:topic"  doctype-system="topic.dtd" indent="yes" method="xml"/>

   

<xsl:template match="node()|@*">
<xsl:copy>
<xsl:apply-templates select="node()|@*"/>
</xsl:copy>
</xsl:template>
    
    <xsl:template match="LearningStandards">
        <topic id="x1" xml:lang="en-US" outputclass="CCSSI-DITA"><title/>
            <body>
            <xsl:apply-templates/>
            </body>
        </topic>
    </xsl:template>
    
    <xsl:template match="CoreStandardVersion">
        
    </xsl:template>
    
    <xsl:template match="LearningStandardItem">
        <bodydiv outputclass="LearningStandardItem">
            <xsl:apply-templates select="@*|node()"/>
        </bodydiv>
    </xsl:template>
    
    <xsl:template match="LearningStandardItem/@xml:lang"/>
    
    <xsl:template match="@RefID">
        <xsl:attribute name="id">
            <xsl:value-of select="."/>
        </xsl:attribute>
    </xsl:template>
    
    <xsl:template match="RefURI">
        <p outputclass="RefURI">
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    
    <xsl:template match="StandardHierarchyLevel">
        <bodydiv outputclass="StandardHierarchyLevel">
            <xsl:apply-templates/>
        </bodydiv>
    </xsl:template>
    
    <xsl:template match="number">
        <p outputclass="number">
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    
    <xsl:template match="description">
        <p outputclass="description">
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    
    <xsl:template match="StatementCodes">
        <bodydiv outputclass="StatementCodes">
            <xsl:apply-templates/>
        </bodydiv>
    </xsl:template>
    
    <xsl:template match="StatementCode">
        <p outputclass="StatementCode">
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    
    <xsl:template match="Statements">
        <bodydiv outputclass="Statements">
            <xsl:apply-templates/>
        </bodydiv>
    </xsl:template>
    
    <xsl:template match="Statement">
        <xsl:variable name="code" select="../preceding-sibling::StatementCodes[1]/StatementCode" />
        <p outputclass="Statement" id="{replace($code, '^\w+\.\w+-\w+\.\w+\.', '')}">
            <xsl:apply-templates/>
        </p>
    </xsl:template>
   
    
    <xsl:template match="GradeLevels">
        <bodydiv outputclass="GradeLevels">
            <xsl:apply-templates/>
        </bodydiv>
    </xsl:template>
    
    <xsl:template match="GradeLevel">
        <p outputclass="GradeLevel">
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    
    <xsl:template match="LearningStandardDocumentRefId">
        <p outputclass="LearningStandardDocumentRefId">
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    
    <xsl:template match="RelatedLearningStandardItems">
     </xsl:template>
    
        
</xsl:stylesheet>
