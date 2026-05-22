import { HistoryItem, PredictionItem } from "../types";

/**
 * Generates an Excel-compatible XML Spreadsheet (SpreadsheetML)
 * This allows native styling, colors, and formatting in Microsoft Excel
 * while remaining lightweight and fully compatible.
 */
export function generateRCoinExcel(
  history: HistoryItem[],
  predictions: PredictionItem[],
  priceUnit: string
): string {
  // Styles and worksheet configuration
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>RCoin Platform</Author>
  <LastAuthor>Ranvidu Jayasinghe</LastAuthor>
  <Created>${new Date().toISOString()}</Created>
  <Company>RCoin Technologies</Company>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="11" ss:Color="#1F2937"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="BrandTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="16" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#001845" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="BrandCopyright">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="9" ss:Italic="1" ss:Color="#1E3A8A"/>
   <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1E40AF"/>
   </Borders>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1E40AF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataRow">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="PredictionRow">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#93C5FD"/>
   </Borders>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="11" ss:Bold="1" ss:Color="#1E3A8A"/>
   <Interior ss:Color="#DBEAFE" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DecimalFormat">
   <NumberFormat ss:Format="#,##0.00"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="BTC Valuation Ledger">
  <Table ss:ExpandedColumnCount="5" x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="20">
   <Column ss:Width="100"/>
   <Column ss:Width="120"/>
   <Column ss:Width="120"/>
   <Column ss:Width="120"/>
   <Column ss:Width="140"/>
   
   <!-- Title Banner -->
   <Row ss:AutoFitHeight="0" ss:Height="40">
    <Cell ss:MergeAcross="4" ss:StyleID="BrandTitle">
     <Data ss:Type="String">RCOIN BITCOIN VALUATION DOCUMENTATION DOSSIER</Data>
    </Cell>
   </Row>
   
   <!-- Copyright Acknowledgement -->
   <Row ss:AutoFitHeight="0" ss:Height="25">
    <Cell ss:MergeAcross="4" ss:StyleID="BrandCopyright">
     <Data ss:Type="String">  Copyright (c) 2026 RCoin. All rights reserved. Author: Ranvidu Jayasinghe. Unit of Price: ${priceUnit}</Data>
    </Cell>
   </Row>
   
   <!-- Blank Spacing Row -->
   <Row ss:Height="15"/>

   <!-- Table Header -->
   <Row ss:AutoFitHeight="0" ss:Height="26">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Date</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Time Window</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Minimum Price</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Maximum Price</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Classification Status</Data></Cell>
   </Row>
`;

  let xmlBody = "";

  // 1. Process standard 30-minute historical values
  history.forEach((item) => {
    xmlBody += `   <Row ss:Height="22" ss:StyleID="DataRow">
    <Cell><Data ss:Type="String">${item.date}</Data></Cell>
    <Cell><Data ss:Type="String">${item.timeRange}</Data></Cell>
    <Cell ss:StyleID="DecimalFormat"><Data ss:Type="Number">${item.minVal}</Data></Cell>
    <Cell ss:StyleID="DecimalFormat"><Data ss:Type="Number">${item.maxVal}</Data></Cell>
    <Cell><Data ss:Type="String">Historical Real-Time</Data></Cell>
   </Row>\n`;
  });

  // 2. Process highlighted future predictions
  predictions.forEach((pred) => {
    xmlBody += `   <Row ss:Height="24" ss:StyleID="PredictionRow">
    <Cell><Data ss:Type="String">${pred.date}</Data></Cell>
    <Cell><Data ss:Type="String">Daily Forecast Profile</Data></Cell>
    <Cell ss:StyleID="DecimalFormat"><Data ss:Type="Number">${pred.low}</Data></Cell>
    <Cell ss:StyleID="DecimalFormat"><Data ss:Type="Number">${pred.high}</Data></Cell>
    <Cell><Data ss:Type="String">Highlighted 7-Day Forecast</Data></Cell>
   </Row>\n`;
  });

  const xmlFooter = `  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <PageSetup>
    <Header x:Margin="0.3"/>
    <Footer x:Margin="0.3"/>
   </PageSetup>
   <Print>
    <ValidPrinterInfo/>
    <HorizontalResolution>600</HorizontalResolution>
    <VerticalResolution>600</VerticalResolution>
   </Print>
   <Selected/>
   <Panes>
    <Pane>
     <Number>3</Number>
     <ActiveRow>1</ActiveRow>
    </Pane>
   </Panes>
   <ProtectObjects>False</ProtectObjects>
   <ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
</Workbook>`;

  return xmlHeader + xmlBody + xmlFooter;
}

export function triggerExcelDownload(history: HistoryItem[], predictions: PredictionItem[], priceUnit: string) {
  const xmlContent = generateRCoinExcel(history, predictions, priceUnit);
  const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = objectUrl;
  link.setAttribute("download", `RCoin_Bitcoin_Valuation_Ledger_${new Date().toISOString().slice(0, 10)}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}
